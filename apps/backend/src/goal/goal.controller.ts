import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { authenticatedUser } from '../common/types/general.types';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {
  }

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto, @Request() req: { user: authenticatedUser['user'] }): Promise<Goal> {
    return await this.goalService.create(createGoalDto, req.user.userId);
  }

  @Get()
  async findAll() {
    return await this.goalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.goalService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return await this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.goalService.remove(id);
  }
}
