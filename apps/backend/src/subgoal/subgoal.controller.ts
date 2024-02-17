import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request } from '@nestjs/common';
import { SubgoalService } from './subgoal.service';
import { CreateSubgoalDto } from './dto/create-subgoal.dto';
import { UpdateSubgoalDto } from './dto/update-subgoal.dto';
import { UserJwtData } from '../common/types/general.types';
import { OwnedResource } from '../common/constants/enums/owned-resources.enum';
import { Resources } from '../common/guards/resource-owner/resource.decorator';
import { Roles } from '../common/guards/roles/role.decorator';
import { UserRole } from '../user/entities/user-roles.enum';

@Controller('subgoals')
export class SubgoalController {
  constructor(private readonly subgoalService: SubgoalService) {}

  @Post()
  create(
    @Body() createSubgoalDto: CreateSubgoalDto,
    @Request()
    req: {
      user: UserJwtData;
    },
  ) {
    return this.subgoalService.create(createSubgoalDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.subgoalService.findAll();
  }

  @Get(':id')
  @Resources(OwnedResource.SUBGOALS)
  async findOne(@Param('id') id: string) {
    return await this.subgoalService.findById(id);
  }

  @Patch(':id')
  @Resources(OwnedResource.SUBGOALS)
  async update(@Param('id') id: string, @Body() updateSubgoalDto: UpdateSubgoalDto) {
    return await this.subgoalService.update(id, updateSubgoalDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Resources(OwnedResource.SUBGOALS)
  async remove(@Param('id') id: string) {
    return await this.subgoalService.remove(id);
  }
}
