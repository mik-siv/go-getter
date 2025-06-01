import { User } from '../../models/user.model';
import { GenericState } from '../../../../common/state/models/GenericState';

export interface UserState extends GenericState {
  user: User;
}
