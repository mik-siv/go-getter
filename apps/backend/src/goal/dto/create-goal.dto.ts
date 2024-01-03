import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ description: 'goal description' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'goal description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;
}
