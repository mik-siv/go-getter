import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'subgoals' })
export class Subgoal {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({ type: 'boolean', default: true })
  private: boolean;

  @ManyToOne(() => Subgoal, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Subgoal;

  @ManyToMany(() => Goal, { nullable: true })
  @JoinTable({
    name: 'goal_subgoals',
    joinColumn: {
      name: 'subgoal_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'goal_id',
      referencedColumnName: 'id',
    },
  })
  goal_subgoals: Goal[];

  @Column({ type: 'json', default: {} })
  metadata: {
    description: string;
    [key: string]: any;
  };
}
