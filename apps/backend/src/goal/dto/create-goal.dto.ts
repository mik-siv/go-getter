import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
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

  @ApiProperty({ description: 'metadata for the goal', type: Metadata })
  @IsOptional()
  @ValidateNested()
  @Type(() => Metadata)
  metadata?: Metadata;
}
