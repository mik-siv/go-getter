import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { v4 as uuidv4 } from 'uuid';
import * as merge from 'lodash.merge';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from '../user/interfaces/user-service.interface';
import { UserService } from '../user/user.service';
import { IGoalService } from './interfaces/goal-service.interface';

@Injectable()
export class GoalService implements IGoalService {

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @Inject(UserService)
    private readonly userService: IUserService,
  ) {
  }

  generateUuid(): string {
    return uuidv4();
  }

  /**
   * Creates a new goal for a given user
   * @param createGoalDto - The creation data transfer object
   * @param userId - unique identifier of the user creating a goal
   */
  async create(createGoalDto: CreateGoalDto, userId?: string): Promise<Goal> {
    const user: User = await this.userService.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    const goal: Goal = merge(createGoalDto, {
      id: this.generateUuid(),
      created_by: user,
      contributors: [user],
      parent: null,
    });
    const goalEntity: Goal = this.goalRepository.create(goal);
    return await this.goalRepository.save(goalEntity);
  }

  async findAll(): Promise<Goal[]> {
    return await this.goalRepository.find();
  }

  async findById(id: string): Promise<Goal> {
    if (!id) throw new NotFoundException(`No goals with id ${id} found`);
    const goal: Goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException(`No goals with id ${id} found`);
    return goal;
  }

  async findBy(attrs: Partial<Goal>): Promise<Goal[]> {
    return await this.goalRepository.findBy(attrs);
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const foundGoal: Goal = await this.findById(id);
    const updatedGoal: Goal = merge(foundGoal, updateGoalDto);
    return await this.goalRepository.save(updatedGoal);
  }

  async remove(id: string): Promise<Goal> {
    const foundGoal: Goal = await this.findById(id);
    return await this.goalRepository.remove(foundGoal);
  }
}
