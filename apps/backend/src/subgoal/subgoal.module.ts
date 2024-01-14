import { Module } from '@nestjs/common';
import { SubgoalService } from './subgoal.service';
import { SubgoalController } from './subgoal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subgoal } from './entities/subgoal.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Subgoal])],
  controllers: [SubgoalController],
  providers: [SubgoalService],
})
export class SubgoalModule {}
