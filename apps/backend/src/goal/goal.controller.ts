import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpCode } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { UserJwtData } from '../common/types/general.types';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {
  }

  @Post()
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @Request()
      req: {
      user: UserJwtData;
    },
  ): Promise<Goal> {
    return await this.goalService.create(createGoalDto, req.user.userId);
  }

  @Get()
  async findAll(): Promise<Goal[]> {
    return await this.goalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Goal> {
    return await this.goalService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto): Promise<Goal> {
    return await this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<Goal> {
    return await this.goalService.remove(id);
  }
}
