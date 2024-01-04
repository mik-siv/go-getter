import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { ICrudService } from '../../common/types/interfaces/crud.interface';

export interface IUserService extends ICrudService<User, CreateUserDto, UpdateUserDto> {
}