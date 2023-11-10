import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'uuid', unique: true })
  id: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ unique: true, nullable: true })
  @Index({ unique: true })
  @ApiProperty()
  email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'json', default: [] })
  roles: any[];
}
