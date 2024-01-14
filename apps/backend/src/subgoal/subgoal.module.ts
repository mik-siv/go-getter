import { Module } from '@nestjs/common';
import { SubgoalService } from './subgoal.service';
import { SubgoalController } from './subgoal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subgoal } from './entities/subgoal.entity';
import { UserModule } from '../user/user.module';
import { GoalModule } from '../goal/goal.module';

@Module({
  imports: [UserModule, GoalModule, TypeOrmModule.forFeature([Subgoal])],
  controllers: [SubgoalController],
  providers: [SubgoalService],
  exports: [SubgoalService],
})
export class SubgoalModule {}
