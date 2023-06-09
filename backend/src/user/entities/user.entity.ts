import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @Column('uuid')
  id: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column('json')
  @ApiProperty()
  roles: JSON;
}
