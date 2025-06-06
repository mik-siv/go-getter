import { Test, TestingModule } from '@nestjs/testing';
import { GoalService } from '../goal.service';
import { GoalRepositoryMock } from './mocks/goal.repository.mock';
import { UserService } from '../../user/user.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { Goal } from '../entities/goal.entity';
import { NotFoundException } from '@nestjs/common';
import { SubgoalService } from '../../subgoal/subgoal.service';
import { In } from 'typeorm';

describe('GoalService', () => {
  let service: GoalService;
  let findByIdSpy: jest.SpyInstance;

  const subgoalServiceMock = {
    findBy: jest.fn(),
  } as any;
  const goalData: CreateGoalDto = {
    name: 'First Goal',
    metadata: {
      description: "It's my first goal",
    },
    private: true,
  };
  const subgoalData = { id: 1, name: 'start' };
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
      providers: [
        GoalService,
        { provide: UserService, useValue: userServiceMock },
        { provide: SubgoalService, useValue: subgoalServiceMock },
        {
          provide: 'GoalRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<GoalService>(GoalService);
    (subgoalServiceMock.findBy as jest.Mock).mockReturnValue([subgoalData]);
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
      contributors: null,
      parent: null,
      subgoals: [],
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
    const subgoalSpy = jest.spyOn(subgoalServiceMock, 'findBy');
    service.findById = jest.fn().mockReturnValue({ id, name: 'oldName', metadata: { description: 'old description' } });
    findByIdSpy = jest.spyOn(service, 'findById');
    const updateGoalData = { subgoals: ['1', '2', '3'], ...goalData };
    const repoSaveSpy = jest.spyOn(repository, 'save');
    expect(await service.update(id, updateGoalData)).toEqual({ id, subgoals: [subgoalData], ...goalData });
    expect(subgoalSpy).toBeCalledWith({ id: In(updateGoalData.subgoals) });
    expect(findByIdSpy).toBeCalledWith(id);
    expect(repoSaveSpy).toBeCalledWith({ id, subgoals: [subgoalData], ...goalData });
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

  it('should find available goals', async () => {
    const mockGoalsData = ['1', '2', '3'];
    userServiceMock.findById.mockReturnValue({
      goals: Promise.resolve(mockGoalsData),
      contributing_to: Promise.resolve(mockGoalsData),
    });
    const availableGoals = await service.findAvailableGoals(fakeUser.id);
    expect(availableGoals).toEqual({ goals: mockGoalsData, contributing_to: mockGoalsData });
  });

  it('should remove a contributor from a goal', async () => {
    const goalId = 'goalId';
    const userId = 'userId';
    const user = { id: userId } as any;
    const goal = {
      id: goalId,
      contributors: Promise.resolve([{ id: userId } as any, { id: 'otherUserId' } as any]),
    } as Goal;

    // Mock the findById calls to simulate finding the user and the goal
    jest.spyOn(service, 'findById').mockImplementation((id) => {
      if (id === goalId) {
        return Promise.resolve(goal);
      }
    });

    userServiceMock.findById.mockReturnValue(user);

    // Mock the userRepository save method
    const repoSaveSpy = jest.spyOn(repository, 'save');

    // Run removeContributor method
    const result = await service.removeContributor(goalId, userId);

    // Verify the save method was called with the updated goal
    expect(repoSaveSpy).toBeCalledWith({ ...goal, contributors: [{ id: 'otherUserId' } as any] });
    // Verify the returned goal doesn't include the removed user
    expect((await result.contributors).some((contributor) => contributor.id === userId)).toBe(false);
  });

  it('should add a contributor to a goal', async () => {
    const goalId = 'goalId';
    const contributorId = 'contributorId';
    const contributor = { id: contributorId } as any;
    const goal = {
      id: goalId,
      contributors: Promise.resolve([{ id: 'otherUserId' } as any]),
    } as Goal;

    jest.spyOn(service, 'findById').mockImplementation((id) => {
      if (id === goalId) {
        return Promise.resolve(goal);
      }
    });
    userServiceMock.findById.mockReturnValue(contributor);
    const repoSaveSpy = jest.spyOn(repository, 'save');
    const result = await service.addContributor(goalId, contributorId);

    expect(repoSaveSpy).toBeCalledWith({ ...goal, contributors: [{ id: 'otherUserId' } as any, contributor] });
    expect((await result.contributors).some((user) => user.id === contributorId)).toBe(true);
  });
});
