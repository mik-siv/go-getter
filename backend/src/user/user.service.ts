import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { saltRounds } from '../common/constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    try {
      const existingUser: any = await this.findByEmail(email);
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

      const user = await this.userRepository.create(userData);
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findBy({ email });
  }

  async findById(id: string) {
    return await this.userRepository.findBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
