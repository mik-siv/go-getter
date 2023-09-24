import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface UserServiceInterface {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User[]>;
    findById(id: string): Promise<User[]>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}