import { Test, TestingModule } from '@nestjs/testing';
import { SubgoalController } from './subgoal.controller';
import { SubgoalService } from './subgoal.service';

describe('SubgoalController', () => {
  let controller: SubgoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubgoalController],
      providers: [SubgoalService],
    }).compile();

    controller = module.get<SubgoalController>(SubgoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
