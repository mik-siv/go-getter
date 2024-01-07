import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { ICrudService } from '../../common/types/interfaces/crud.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserService extends ICrudService<User, CreateUserDto, UpdateUserDto> {
}