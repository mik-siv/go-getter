import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface UserServiceInterface {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findBy(attrs: Partial<User>): Promise<User[]>;
    findById(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}