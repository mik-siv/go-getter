import { Test, TestingModule } from '@nestjs/testing';
import { SubgoalController } from '../subgoal.controller';
import { SubgoalService } from '../subgoal.service';
import { ISubgoalService } from '../interfaces/subgoal-service.interface';
import { CreateSubgoalDto } from '../dto/create-subgoal.dto';
import { Subgoal } from '../entities/subgoal.entity';
import { MockCrudService } from '../../common/mocks/crud.service.mock';
import { UpdateSubgoalDto } from '../dto/update-subgoal.dto';

describe('SubgoalController', () => {
  let controller: SubgoalController;
  let subgoalServiceMock: ISubgoalService;
  let createSubgoalSpy, updateSubgoalSpy, removeSubgoalSpy, findByIdSpy, readSubgoalCollectionSpy;
  const subgoalId = 'test-1234';
  const subgoalData: CreateSubgoalDto = {
    name: 'test subgoal',
    private: true,
    metadata: {
      description: "it's a test subgoal",
    },
  };
  const userJWTData = { user: { id: 'test-1234', username: 'test-user' } };

  beforeEach(async () => {
    subgoalServiceMock = new MockCrudService<Subgoal, CreateSubgoalDto, UpdateSubgoalDto>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubgoalController],
      providers: [{ provide: SubgoalService, useValue: subgoalServiceMock }],
    }).compile();

    subgoalServiceMock.create = jest.fn().mockReturnValue(subgoalData);
    subgoalServiceMock.findById = jest.fn().mockReturnValue(subgoalData);
    subgoalServiceMock.findAll = jest.fn().mockReturnValue([subgoalData]);
    subgoalServiceMock.update = jest.fn().mockReturnValue(subgoalData);
    subgoalServiceMock.remove = jest.fn().mockReturnValue(subgoalData);

    controller = module.get<SubgoalController>(SubgoalController);
    createSubgoalSpy = jest.spyOn(subgoalServiceMock, 'create');
    readSubgoalCollectionSpy = jest.spyOn(subgoalServiceMock, 'findAll');
    findByIdSpy = jest.spyOn(subgoalServiceMock, 'findById');
    updateSubgoalSpy = jest.spyOn(subgoalServiceMock, 'update');
    removeSubgoalSpy = jest.spyOn(subgoalServiceMock, 'remove');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a subgoal', async () => {
    expect(await controller.create(subgoalData, userJWTData as any)).toEqual(subgoalData);
    expect(createSubgoalSpy).toBeCalledWith(subgoalData, userJWTData.user.id);
  });

  it('should get all subgoals', async () => {
    expect(await controller.findAll()).toEqual([subgoalData]);
    expect(readSubgoalCollectionSpy).toBeCalledTimes(1);
  });

  it('should get a subgoal by id', async () => {
    expect(await controller.findOne(subgoalId)).toEqual(subgoalData);
    expect(findByIdSpy).toBeCalledWith(subgoalId);
  });

  it('should update subgoal by id', async () => {
    expect(await controller.update(subgoalId, subgoalData)).toEqual(subgoalData);
    expect(updateSubgoalSpy).toBeCalledWith(subgoalId, subgoalData);
  });

  it('should delete subgoal by id', async () => {
    expect(await controller.remove(subgoalId)).toEqual(subgoalData);
    expect(removeSubgoalSpy).toBeCalledWith(subgoalId);
  });
});
