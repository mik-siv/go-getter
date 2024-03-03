import { User } from '../entities/user.entity';

export type UserSubset = Pick<User, 'id' | 'goals' | 'subgoals' | 'contributing_to'>;
