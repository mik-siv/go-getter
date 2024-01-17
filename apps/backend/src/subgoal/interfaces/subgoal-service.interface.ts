import { ICrudService } from '../../common/types/interfaces/crud.interface';
import { Subgoal } from '../entities/subgoal.entity';
import { CreateSubgoalDto } from '../dto/create-subgoal.dto';
import { UpdateSubgoalDto } from '../dto/update-subgoal.dto';

export interface ISubgoalService extends ICrudService<Subgoal, CreateSubgoalDto, UpdateSubgoalDto> {
  create(createDto: CreateSubgoalDto): Promise<Subgoal>;
  create(createDto: CreateSubgoalDto, userId: string): Promise<Subgoal>;
}
