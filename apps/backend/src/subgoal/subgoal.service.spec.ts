import { Test, TestingModule } from '@nestjs/testing';
import { SubgoalService } from './subgoal.service';

describe('SubgoalService', () => {
  let service: SubgoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubgoalService],
    }).compile();

    service = module.get<SubgoalService>(SubgoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
