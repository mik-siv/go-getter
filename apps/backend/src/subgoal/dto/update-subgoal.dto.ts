import { PartialType } from '@nestjs/swagger';
import { CreateSubgoalDto } from './create-subgoal.dto';

export class UpdateSubgoalDto extends PartialType(CreateSubgoalDto) {}
