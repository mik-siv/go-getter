import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { v4 as uuidv4 } from 'uuid';
import { merge } from 'lodash';
import { User } from '../user/entities/user.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from '../user/interfaces/user-service.interface';
import { UserService } from '../user/user.service';
import { IGoalService } from './interfaces/goal-service.interface';
import { SubgoalService } from '../subgoal/subgoal.service';
import { ISubgoalService } from '../subgoal/interfaces/subgoal-service.interface';

@Injectable()
export class GoalService implements IGoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @Inject(UserService)
    private readonly userService: IUserService,
    @Inject(forwardRef(() => SubgoalService))
    private readonly subgoalService: ISubgoalService,
  ) {}

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { subgoals, ...goalData } = createGoalDto;
    const goal: Omit<Goal, 'created_date'> = merge(goalData, {
      id: this.generateUuid(),
      created_by: user,
      contributors: [],
      parent: null,
      subgoals: [],
    });
    const goalEntity: Goal = this.goalRepository.create(goal);
    return await this.goalRepository.save(goalEntity);
  }

  findAll(): Promise<Goal[]> {
    return this.goalRepository.find();
  }

  /**
   * Finds the available goals for a given user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Record<string, Goal[]>>} - An object that contains owned goals and contributing goals.
   * @throws {NotFoundException} - If the user is not found.
   */
  async findAvailableGoals(userId?: string): Promise<Record<string, Goal[]>> {
    const user: User = await this.userService.findById(userId);
    const goals: Goal[] = await user.goals;
    const contributing_to: Goal[] = await user.contributing_to;
    return { goals, contributing_to };
  }

  async findById(id: string): Promise<Goal> {
    if (!id) throw new NotFoundException(`No goals with id ${id} found`);
    const goal: Goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException(`No goals with id ${id} found`);
    return goal;
  }

  findBy(attrs: FindOptionsWhere<Goal> | FindOptionsWhere<Goal>[]): Promise<Goal[]> {
    return this.goalRepository.findBy(attrs);
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const { subgoals, contributors, ...goalData } = updateGoalDto;
    const foundGoal: Goal = await this.findById(id);
    const updatedGoal: Goal = merge(foundGoal, goalData);

    if (typeof subgoals !== 'undefined') {
      updatedGoal.subgoals = subgoals.length > 0 ? await this.subgoalService.findBy({ id: In(subgoals) }) : [];
    }

    if (typeof contributors !== 'undefined') {
      updatedGoal.contributors = contributors.length > 0 ? await this.userService.findBy({ id: In(contributors) }) : [];
    }

    return await this.goalRepository.save(updatedGoal);
  }

  async remove(id: string): Promise<Goal> {
    const foundGoal: Goal = await this.findById(id);
    return await this.goalRepository.remove(foundGoal);
  }
}
