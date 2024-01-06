import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from '../goal.service';
import { GoalRepositoryMock } from './mocks/goal.repository.mock';
import { UserService } from '../../user/user.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { Goal } from '../entities/goal.entity';
import { NotFoundException } from '@nestjs/common';

describe('GoalService', () => {
  let service: GoalService;
  let findByIdSpy: jest.SpyInstance;

  const goalData: CreateGoalDto = {
    name: 'First Goal',
    metadata: {
      description: 'It\'s my first goal',
    },
    private: true,
  };
  const fakeUser = {
    id: '123',
    email: 'test@test.com',
  };
  const userServiceMock = {
    findById: jest.fn(),
  };
  let repository: GoalRepositoryMock;

  beforeEach(async () => {
    repository = new GoalRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalService, { provide: UserService, useValue: userServiceMock }, {
        provide: 'GoalRepository',
        useValue: repository,
      }],
    }).compile();

    service = module.get<GoalService>(GoalService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new goal', async () => {
    userServiceMock.findById.mockReturnValue(fakeUser);
    const result: Goal = await service.create(goalData, fakeUser.id);
    expect(result).toEqual({
      id: expect.any(String),
      created_by: fakeUser,
      contributors: [fakeUser],
      parent: null,
      ...goalData,
    });
  });

  it('should fail to create a goal if user not found', async () => {
    userServiceMock.findById.mockReturnValue(null);
    try {
      await service.create(goalData, fakeUser.id);
    } catch (e) {
      expect(e).toEqual(new NotFoundException(`User with id ${fakeUser.id} not found`));
    }
  });

  it('should find all goals', async () => {
    const goals = [goalData, { name: 'Goal nr. 2' }] as Goal[];
    repository.items = goals;
    expect(await service.findAll()).toEqual(goals);
  });

  it.each(['1', '2', null, '3'])('should find goals by id %id', async (id) => {
    repository.items = [{ id: '1' }, { id: '2' }] as Goal[];
    const findOneSpy = jest.spyOn(repository, 'findOne');
    if (!id || id === '3') {
      try {
        await service.findById(id);
      } catch (e) {
        expect(e).toEqual(new NotFoundException(`No goals with id ${id} found`));
      }
    } else {
      expect(await service.findById(id)).toEqual({ id });
    }
    id ? expect(findOneSpy).toBeCalledWith({ where: { id } }) : expect(findOneSpy).toBeCalledTimes(0);
  });

  it('should find by attributes', async () => {
    repository.findBy = jest.fn();
    const findBySpy = jest.spyOn(repository, 'findBy');
    await service.findBy(goalData as any);
    expect(findBySpy).toBeCalledWith(goalData);
  });

  it('should update the goal', async () => {
    const id = '123';
    service.findById = jest.fn().mockReturnValue({ id, name: 'oldName', metadata: { description: 'old description' } });
    findByIdSpy = jest.spyOn(service, 'findById');
    const repoSaveSpy = jest.spyOn(repository, 'save');
    expect(await service.update(id, goalData)).toEqual({ id, ...goalData });
    expect(findByIdSpy).toBeCalledWith(id);
    expect(repoSaveSpy).toBeCalledWith({ id, ...goalData });
  });

  it('should delete goal by id', async () => {
    const goal = { id: '123' };
    service.findById = jest.fn().mockReturnValue(goal);
    findByIdSpy = jest.spyOn(service, 'findById');
    const repoDeleteSpy = jest.spyOn(repository, 'remove');
    expect(await service.remove(goal.id)).toEqual(goal);
    expect(findByIdSpy).toBeCalledWith(goal.id);
    expect(repoDeleteSpy).toBeCalledWith(goal);
  });

});
