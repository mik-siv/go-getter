import { CreateGoalDto } from '../dto/create-goal.dto';
import { Goal } from '../entities/goal.entity';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { ICrudService } from '../../common/types/interfaces/crud.interface';

export interface IGoalService extends ICrudService<Goal, CreateGoalDto, UpdateGoalDto> {
  create(createDto: CreateGoalDto): Promise<Goal>;
  create(createDto: CreateGoalDto, userId: string): Promise<Goal>;
  addContributor(goalId: string, contributorId: string): Promise<Goal>;
  removeContributor(goalId: string, contributorId: string): Promise<Goal>;
}
