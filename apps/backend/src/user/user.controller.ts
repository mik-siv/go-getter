import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from '../auth/guards/jwt-auth.guard';
import { Resources } from '../common/guards/resource-owner/resource.decorator';
import { OwnedResource } from '../common/constants/enums/owned-resources.enum';
import { Roles } from '../common/guards/roles/role.decorator';
import { UserRole } from './entities/user-roles.enum';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Resources(OwnedResource.USER_ID)
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Resources(OwnedResource.USER_ID)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/roles/:id')
  @Roles(UserRole.ADMIN)
  modifyRoles(@Param('id') id: string, @Body() body: UpdateUserRoleDto): Promise<User> {
    return this.userService.updateRoles(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Resources(OwnedResource.USER_ID)
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
