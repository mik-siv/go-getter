import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'goals' })
export class Goal {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  private: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'goal_contributors',
    joinColumn: {
      name: 'goal_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  contributors: User[];

  @ManyToOne(() => Goal, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Goal;

  @Column({ type: 'json', default: [] })
  subgoals: any[];

  @Column({ type: 'json', default: {} })
  metadata: {
    description: string;
    [key: string]: any;
  };
}
