import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '../common/constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { IUserService } from './interfaces/user-service.interface';
import * as merge from 'lodash.merge';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  generateUuid(): string {
    return uuidv4();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email } = createUserDto;
    const existingUser: User[] = await this.findBy({ email });
    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const id = this.generateUuid();
    const userData = {
      id,
      username,
      email,
      password: hashedPassword,
    };

    const user: User = await this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    if (!id) throw new NotFoundException(`User with id ${id} not found`);
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findBy(attrs: Partial<User>): Promise<User[]> {
    return await this.userRepository.findBy(attrs);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const foundUser: User = await this.findById(id);
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await this.hashPassword(password);
    }
    const updatedData = merge(foundUser, updateUserDto);
    await this.userRepository.save(updatedData);
    return updatedData;
  }

  async remove(id: string): Promise<User> {
    const foundUser: User = await this.findById(id);
    if (!foundUser) throw new NotFoundException(`User with id ${id} not found`);
    return await this.userRepository.remove(foundUser);
  }
}
