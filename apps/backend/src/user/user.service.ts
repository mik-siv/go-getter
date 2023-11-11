import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '../common/constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserServiceInterface } from './interfaces/user-service.interface';
import * as merge from 'lodash.merge';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    try {
      const existingUser: User[] = await this.findBy({ email });
      if (existingUser.length > 0) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const id = uuidv4();
      const userData = {
        id,
        username,
        email,
        password: hashedPassword,
      };

      const user: User = await this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findBy(attrs: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(attrs);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const foundUser: User = await this.findById(id);
      merge(foundUser, updateUserDto);
      return await this.userRepository.save(foundUser);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const foundUser: User = await this.findById(id);
      return await this.userRepository.remove(foundUser);
    } catch (err) {
      throw err;
    }
  }
}
