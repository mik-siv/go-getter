import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Goal } from './entities/goal.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Goal])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
