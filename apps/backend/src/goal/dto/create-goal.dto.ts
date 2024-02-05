import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Metadata {
  @ApiProperty({ description: 'goal description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;
}

export class CreateGoalDto {
  @ApiProperty({ description: 'goal name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'goal privacy' })
  @IsNotEmpty()
  @IsBoolean()
  private: boolean;

  @ApiProperty({ description: 'A list of subgoal ids' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each item in goalIds must be a string' })
  subgoals?: string[];

  @ApiProperty({ description: 'A list of contributor user ids' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each item in goalIds must be a string' })
  contributors?: string[];

  @ApiProperty({ description: 'metadata for the goal', type: Metadata })
  @IsOptional()
  @ValidateNested()
  @Type(() => Metadata)
  metadata: Metadata;
}
