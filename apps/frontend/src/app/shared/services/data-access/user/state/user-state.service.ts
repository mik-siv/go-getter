import { computed, Injectable, signal } from '@angular/core';
import { RequestStatus } from '../../models/RequestStatus';
import { StatefulService } from '../../models/StatefulService';
import { User } from '../../../../models/user.model';

export interface UserState {
  error: Error;
  status: RequestStatus;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService implements StatefulService<UserState> {

  emptyState: UserState = {
    user: undefined,
    error: undefined,
    status: undefined,
  };

  //state
  readonly state = signal<UserState>({
    user: undefined,
    error: undefined,
    status: undefined,
  });

  //selectors
  user = computed(() => this.state().user);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);

  updateState(state: Partial<UserState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  }

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  setUser(user: User): void {
    this.updateState({ user, error: undefined, status: RequestStatus.SUCCESS });
  }

  setErrorState(error: Error): void {
    this.updateState({ user: undefined, error, status: RequestStatus.ERROR });
  }

  refreshState(): void {
    this.state.set(this.emptyState);
  }
}
