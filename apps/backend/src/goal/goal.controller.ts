import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { AuthenticatedUser, UserJwtData } from '../common/types/general.types';
import { Roles } from '../common/guards/roles/role.decorator';
import { UserRole } from '../user/entities/user-roles.enum';
import { Resources } from '../common/guards/resource-owner/resource.decorator';
import { OwnedResource } from '../common/constants/enums/owned-resources.enum';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @Request()
    req: {
      user: UserJwtData;
    },
  ): Promise<Goal> {
    return await this.goalService.create(createGoalDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Goal[]> {
    return await this.goalService.findAll();
  }

  @Get('/my-goals')
  async findUserGoals(@Request() req: AuthenticatedUser) {
    return await this.goalService.findAvailableGoals(req.user.id);
  }

  @Get(':id')
  @Resources(OwnedResource.GOALS, OwnedResource.CONTRIBUTING_TO)
  async findOne(@Param('id') id: string): Promise<Goal> {
    return await this.goalService.findById(id);
  }

  @Patch(':id')
  @Resources(OwnedResource.GOALS, OwnedResource.CONTRIBUTING_TO)
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto): Promise<Goal> {
    return await this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Resources(OwnedResource.GOALS)
  async remove(@Param('id') id: string): Promise<Goal> {
    return await this.goalService.remove(id);
  }

  @Patch(':id/stop-contributing/:userId')
  @HttpCode(204)
  @Resources(OwnedResource.CONTRIBUTING_TO)
  async removeContributor(@Request() req: AuthenticatedUser, @Param('id') id: string, @Param('userId') userId: string) {
    if (req.user.id === userId) {
      return await this.goalService.removeContributor(id, userId);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch(':id/add-contributor/:userId')
  @Resources(OwnedResource.GOALS)
  async addContributor(@Param('id') id: string, @Param('userId') userId: string) {
    return await this.goalService.addContributor(id, userId);
  }
}
