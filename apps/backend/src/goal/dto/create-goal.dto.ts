import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Metadata {
  @ApiProperty({ description: 'goal description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
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
  @IsString()
  subgoals?: string[];

  @ApiProperty({ description: 'metadata for the goal', type: Metadata })
  @IsOptional()
  @ValidateNested()
  @Type(() => Metadata)
  metadata?: Metadata;
}
