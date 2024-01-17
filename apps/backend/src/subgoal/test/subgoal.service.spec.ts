import { Test, TestingModule } from '@nestjs/testing';
import { SubgoalService } from '../subgoal.service';
import { UserService } from '../../user/user.service';
import { GenericRepositoryMock } from '../../common/mocks/generic.repository.mock';
import { Subgoal } from '../entities/subgoal.entity';
import { GoalService } from '../../goal/goal.service';
import { NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';

describe('SubgoalService', () => {
  let service: SubgoalService;
  const userServiceMock = {
    findById: jest.fn(),
  };
  const goalData = { id: '1', name: 'big goal' };
  const mockGoalService = {
    findById: jest.fn(),
    findBy: jest.fn(),
  };
  const fakeUser = {
    id: '123',
    email: 'test@test.com',
  };
  const createSubgoalDto = {
    name: 'subgoal',
    created_by: '123',
    private: true,
    goalIds: ['1'],
    metadata: {
      description: 'subgoal description',
    },
  };
  let subgoalRepositoryMock: GenericRepositoryMock<Subgoal>;
  beforeEach(async () => {
    subgoalRepositoryMock = new GenericRepositoryMock<Subgoal>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubgoalService,
        { provide: UserService, useValue: userServiceMock },
        {
          provide: GoalService,
          useValue: mockGoalService,
        },
        { provide: 'SubgoalRepository', useValue: subgoalRepositoryMock },
      ],
    }).compile();

    service = module.get<SubgoalService>(SubgoalService);
    mockGoalService.findById.mockReturnValue(goalData);
    mockGoalService.findBy.mockReturnValue([goalData]);
    userServiceMock.findById.mockReturnValue(fakeUser);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new subgoal', async () => {
    const subgoal = await service.create(createSubgoalDto, fakeUser.id);
    expect(subgoal).toBeDefined();
    expect(subgoal).toEqual({
      id: expect.any(String),
      name: createSubgoalDto.name,
      created_by: fakeUser,
      private: createSubgoalDto.private,
      goal_subgoals: [goalData],
      metadata: createSubgoalDto.metadata,
      parent: null,
    });
  });

  it('should fail to create a subgoal if user is not found', async () => {
    userServiceMock.findById.mockReturnValue(undefined);
    await expect(service.create(createSubgoalDto, 'nonexistentUserId')).rejects.toThrow(NotFoundException);
  });

  it('should find all subgoals', async () => {
    subgoalRepositoryMock.items = [
      { id: '1', name: 'subgoal1' },
      { id: '2', name: 'subgoal2' },
      { id: '3', name: 'subgoal3' },
    ] as Subgoal[];

    const subgoals = await service.findAll();

    expect(subgoals).toHaveLength(3);
    expect(subgoals).toEqual(subgoalRepositoryMock.items);
  });

  it('should find a subgoal by id', async () => {
    const subgoalId = '1';
    const subgoal = { id: subgoalId, name: 'subgoal1' } as Subgoal;
    subgoalRepositoryMock.items = [subgoal];

    const result = await service.findById(subgoalId);

    expect(result).toEqual(subgoal);
  });

  it('should find subgoals by attributes', async () => {
    const attrs = { name: 'subgoal1' };
    const subgoal = { id: '1', name: 'subgoal1' } as Subgoal;
    subgoalRepositoryMock.items = [subgoal];

    const result = await service.findBy(attrs);

    expect(result).toEqual([subgoal]);
  });

  it('should update a subgoal and associated goals', async () => {
    const subgoalId = '1';
    const goalId = '1';
    const updateSubgoalDto = { name: 'updated subgoal', goalIds: [goalId] };
    const subgoal = { id: subgoalId, name: 'subgoal1' } as Subgoal;
    const goal = { id: goalId, name: 'goal1' } as any;
    const updatedSubgoal = { ...subgoal, name: updateSubgoalDto.name, goal_subgoals: [goal] };
    subgoalRepositoryMock.items = [subgoal];
    mockGoalService.findBy = jest.fn().mockReturnValue([goal]);
    const findByIdSpy = jest.spyOn(service, 'findById').mockImplementation(() => Promise.resolve(subgoal));
    const result = await service.update(subgoalId, updateSubgoalDto);
    expect(mockGoalService.findBy).toHaveBeenCalledWith({ id: In([goalId]) });
    expect(findByIdSpy).toHaveBeenCalledWith(subgoalId);
    expect(result.goal_subgoals).toEqual([goal]);
    expect(result).toEqual(updatedSubgoal);
  });

  it('should remove a subgoal', async () => {
    const subgoalId = '1';
    const subgoal = { id: subgoalId, name: 'subgoal1' } as Subgoal;
    subgoalRepositoryMock.items = [subgoal];

    const result = await service.remove(subgoalId);

    expect(result).toEqual(subgoal);
  });
});
