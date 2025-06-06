import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { merge } from 'lodash';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Goal } from '../goal/entities/goal.entity';
import { GoalService } from '../goal/goal.service';
import { IGoalService } from '../goal/interfaces/goal-service.interface';
import { User } from '../user/entities/user.entity';
import { IUserService } from '../user/interfaces/user-service.interface';
import { UserService } from '../user/user.service';
import { CreateSubgoalDto } from './dto/create-subgoal.dto';
import { UpdateSubgoalDto } from './dto/update-subgoal.dto';
import { Subgoal } from './entities/subgoal.entity';
import { ISubgoalService } from './interfaces/subgoal-service.interface';

@Injectable()
export class SubgoalService implements ISubgoalService {
  constructor(
    @InjectRepository(Subgoal)
    private readonly subgoalRepository: Repository<Subgoal>,
    @Inject(UserService)
    private readonly userService: IUserService,
    @Inject(forwardRef(() => GoalService))
    private readonly goalService: IGoalService,
  ) {}

  generateUuid(): string {
    return uuidv4();
  }

  async create(createSubgoalDto: CreateSubgoalDto, userId?: string): Promise<Subgoal> {
    const user: User = await this.userService.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    const { goalIds, ...subGoalData } = createSubgoalDto;
    const subgoal: Subgoal = merge(subGoalData, {
      id: this.generateUuid(),
      created_by: user,
      parent: null,
      goal_subgoals: [],
    });
    if (goalIds) {
      const [goalId] = goalIds;
      const goal: Goal = await this.goalService.findById(goalId);
      if (!goal) throw new NotFoundException(`Goal with id ${goalId} not found`);
      subgoal.goal_subgoals = [goal];
    }
    const subgoalEntity: Subgoal = this.subgoalRepository.create(subgoal);
    return this.subgoalRepository.save(subgoalEntity);
  }

  async findAll(): Promise<Subgoal[]> {
    return await this.subgoalRepository.find();
  }

  async findById(id: string): Promise<Subgoal> {
    if (!id) throw new NotFoundException(`No subgoals with id ${id} found`);
    const subgoal: Subgoal = await this.subgoalRepository.findOne({ where: { id } });
    if (!subgoal) throw new NotFoundException(`No subgoals with id ${id} found`);
    return subgoal;
  }

  async findBy(attrs: FindOptionsWhere<Subgoal> | FindOptionsWhere<Subgoal>[]): Promise<Subgoal[]> {
    return await this.subgoalRepository.findBy(attrs);
  }

  async update(id: string, updateSubgoalDto: UpdateSubgoalDto): Promise<Subgoal> {
    const { goalIds, ...subgoalData } = updateSubgoalDto;
    const foundSubgoal: Subgoal = await this.findById(id);
    const updatedSubgoal = merge(foundSubgoal, subgoalData);
    let goalsList: Goal[];
    Array.isArray(goalIds) && goalIds.length > 0
      ? (goalsList = await this.goalService.findBy({ id: In(goalIds) }))
      : (goalsList = foundSubgoal.goal_subgoals);
    updatedSubgoal.goal_subgoals = goalsList;
    return this.subgoalRepository.save(updatedSubgoal);
  }

  async remove(id: string): Promise<Subgoal> {
    const foundSubgoal = await this.findById(id);
    return this.subgoalRepository.remove(foundSubgoal);
  }
}
