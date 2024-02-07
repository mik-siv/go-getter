import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from '../common/types/general.types';
import { User } from './entities/user.entity';
import { Public } from '../common/decorators/public.decorator';
import { Resources } from '../common/decorators/resource.decorator';
import { OwnedResource } from '../common/constants/enums/owned-resources.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Resources(OwnedResource.USER_ID)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Resources(OwnedResource.USER_ID)
  findOne(@Param('id') id: string, @Request() req: AuthenticatedUser): Promise<User> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Resources(OwnedResource.USER_ID)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Resources(OwnedResource.USER_ID)
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
