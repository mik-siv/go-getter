import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { SubgoalService } from './subgoal.service';
import { CreateSubgoalDto } from './dto/create-subgoal.dto';
import { UpdateSubgoalDto } from './dto/update-subgoal.dto';
import { authenticatedUser } from '../common/types/general.types';

@Controller('subgoals')
export class SubgoalController {
  constructor(private readonly subgoalService: SubgoalService) {}

  @Post()
  create(
    @Body() createSubgoalDto: CreateSubgoalDto,
    @Request()
    req: {
      user: authenticatedUser['user'];
    },
  ) {
    return this.subgoalService.create(createSubgoalDto, req.user.userId);
  }

  @Get()
  async findAll() {
    return await this.subgoalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subgoalService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubgoalDto: UpdateSubgoalDto) {
    return await this.subgoalService.update(id, updateSubgoalDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subgoalService.remove(id);
  }
}
