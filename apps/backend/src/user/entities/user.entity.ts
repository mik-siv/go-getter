import { Entity, Column, CreateDateColumn, PrimaryColumn, Index, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';
import { Subgoal } from '../../subgoal/entities/subgoal.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  @Index({ unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'json', default: [] })
  roles: any[];

  @OneToMany(() => Goal, (goal) => goal.created_by)
  goals: Promise<Goal[]>;

  @OneToMany(() => Subgoal, (subgoal) => subgoal.created_by)
  subgoals: Promise<Subgoal[]>;

  @ManyToMany(() => Goal, (goal) => goal.contributors)
  @JoinTable({
    name: 'goal_contributors',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'goal_id',
      referencedColumnName: 'id',
    },
  })
  contributing_to: Promise<Goal[]>;
}
