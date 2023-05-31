import { IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(10)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Min(6)
  @Max(20)
  password: string;
}
