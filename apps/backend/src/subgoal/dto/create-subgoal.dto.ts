import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubgoalMetadata {
  @ApiProperty({ description: 'subgoal description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class CreateSubgoalDto {
  @ApiProperty({ description: 'subgoal name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'subgoal privacy' })
  @IsNotEmpty()
  @IsBoolean()
  private: boolean;

  @ApiProperty({ description: 'metadata for the subgoal', type: SubgoalMetadata })
  @IsOptional()
  @ValidateNested()
  @Type(() => SubgoalMetadata)
  metadata?: SubgoalMetadata;

  @ApiProperty({ description: 'A bigger goal to attach to' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each item in goalIds must be a string' })
  goalIds?: string[];
}
