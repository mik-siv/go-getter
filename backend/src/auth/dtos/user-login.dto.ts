import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}