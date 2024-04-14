import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { ICrudService } from '../../common/types/interfaces/crud.interface';
import { UserSubset } from '../types/user.types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserService extends ICrudService<User, CreateUserDto, UpdateUserDto> {
  validateUserResourceAllowance(
    userId: string,
    requiredResourceId: string,
    requiredProperty: keyof UserSubset,
  ): Promise<boolean>;
}
