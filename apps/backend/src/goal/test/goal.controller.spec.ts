import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from '../goal.controller';
import { GoalService } from '../goal.service';
import { IGoalService } from '../interfaces/goal-service.interface';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { Goal } from '../entities/goal.entity';
import { MockCrudService } from '../../common/mocks/crud.service.mock';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('GoalController', () => {
  let controller: GoalController;
  let goalServiceMock: IGoalService;
  let createGoalSpy,
    updateGoalSpy,
    removeGoalSpy,
    findByIdSpy,
    readGoalCollectionSpy,
    addContributorSpy,
    removeContributorSpy;
  const goalId = 'test-1234';
  const contributorId = 'user-1234';
  const goalData: CreateGoalDto = {
    name: 'test goal',
    private: true,
    metadata: {
      description: "it's a test goal",
    },
  };
  const userJWTData = { user: { id: 'test-1234', username: 'test-user' } };

  beforeEach(async () => {
    goalServiceMock = new MockCrudService<Goal, CreateGoalDto, UpdateGoalDto>() as unknown as IGoalService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [{ provide: GoalService, useValue: goalServiceMock }],
    }).compile();

    goalServiceMock.create = jest.fn().mockReturnValue(goalData);
    goalServiceMock.findById = jest.fn().mockReturnValue(goalData);
    goalServiceMock.findAll = jest.fn().mockReturnValue([goalData]);
    goalServiceMock.update = jest.fn().mockReturnValue(goalData);
    goalServiceMock.remove = jest.fn().mockReturnValue(goalData);
    goalServiceMock.addContributor = jest.fn().mockReturnValue(goalData);
    goalServiceMock.removeContributor = jest.fn().mockReturnValue(goalData);

    controller = module.get<GoalController>(GoalController);
    createGoalSpy = jest.spyOn(goalServiceMock, 'create');
    readGoalCollectionSpy = jest.spyOn(goalServiceMock, 'findAll');
    findByIdSpy = jest.spyOn(goalServiceMock, 'findById');
    updateGoalSpy = jest.spyOn(goalServiceMock, 'update');
    removeGoalSpy = jest.spyOn(goalServiceMock, 'remove');
    removeContributorSpy = jest.spyOn(goalServiceMock, 'removeContributor');
    addContributorSpy = jest.spyOn(goalServiceMock, 'addContributor');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a goal', async () => {
    expect(await controller.create(goalData, userJWTData as any)).toEqual(goalData);
    expect(createGoalSpy).toBeCalledWith(goalData, userJWTData.user.id);
  });

  it('should get all goals', async () => {
    expect(await controller.findAll()).toEqual([goalData]);
    expect(readGoalCollectionSpy).toBeCalledTimes(1);
  });

  it('should get a goal by id', async () => {
    expect(await controller.findOne(goalId)).toEqual(goalData);
    expect(findByIdSpy).toBeCalledWith(goalId);
  });

  it('should update goal by id', async () => {
    expect(await controller.update(goalId, goalData)).toEqual(goalData);
    expect(updateGoalSpy).toBeCalledWith(goalId, goalData);
  });

  it('should delete goal by id', async () => {
    expect(await controller.remove(goalId)).toEqual(goalData);
    expect(removeGoalSpy).toBeCalledWith(goalId);
  });

  it('should stop contributing to goal', async () => {
    const req = { user: { id: contributorId } };
    expect(await controller.removeContributor(req as any, goalId, contributorId)).toEqual(goalData);
    expect(removeContributorSpy).toBeCalledWith(goalId, contributorId);
  });

  it('should stop contributing to goal', async () => {
    const req = { user: { id: '1' } };
    try {
      await controller.removeContributor(req as any, goalId, contributorId);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
    expect(removeContributorSpy).toBeCalledTimes(0);
  });

  it('should add contributor', async () => {
    expect(await controller.addContributor(goalId, contributorId)).toEqual(goalData);
    expect(addContributorSpy).toBeCalledWith(goalId, contributorId);
  });
});
