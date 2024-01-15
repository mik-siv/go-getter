import { forwardRef, Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Goal } from './entities/goal.entity';
import { UserModule } from '../user/user.module';
import { SubgoalModule } from '../subgoal/subgoal.module';

@Module({
  imports: [UserModule, forwardRef(() => SubgoalModule), TypeOrmModule.forFeature([Goal])],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
