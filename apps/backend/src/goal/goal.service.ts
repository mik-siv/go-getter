import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserServiceInterface } from '../user/interfaces/user-service.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class GoalService {

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @Inject(UserService)
    private readonly userService: UserServiceInterface,
  ) {
  }

  generateUuid(): string {
    return uuidv4();
  }

  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const { name, description } = createGoalDto;
    const user: User = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException(`User with id ${userId} is not found`);
    const goal: Goal = this.goalRepository.create(
      {
        name,
        id: this.generateUuid(),
        created_by: user,
        contributors: [user],
        parent: null,
        metadata: { description },
      },
    );
    return await this.goalRepository.save(goal);
  }

  findAll() {
    return `This action returns all goal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
