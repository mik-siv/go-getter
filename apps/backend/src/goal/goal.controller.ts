import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { authenticatedUser } from '../common/types/general.types';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {
  }

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto, @Request() req: { user: authenticatedUser['user'] }): Promise<Goal> {
    console.log(req.user)
    return await this.goalService.create(createGoalDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
