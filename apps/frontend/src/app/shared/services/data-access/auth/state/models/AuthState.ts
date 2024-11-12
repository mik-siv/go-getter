import { GenericState } from '../../../../common/state/models/GenericState';

export interface AuthState extends GenericState{
  isAuthenticated: boolean;
  token: string;
}
