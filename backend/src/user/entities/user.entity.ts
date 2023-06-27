import { Entity, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @Column({ type: 'uuid' })
  id: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty()
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @Column({ type: 'json', default: [] })
  roles: any[];
}
