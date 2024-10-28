import { computed, inject, Injectable, signal } from '@angular/core';
import { RequestStatus } from '../../models/RequestStatus';
import { StatefulService } from '../../models/StatefulService';
import { User } from '../models/user.model';
import { LocalStorageService } from '../../../common/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../../common/local-storage/models/LocalStorageKeys';

export interface UserState {
  error: Error;
  status: RequestStatus;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService implements StatefulService<UserState> {
  private localStorageService = inject(LocalStorageService);

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

  constructor() {
    this.setUserStateFromLocalStorage();
  }

  updateState(state: Partial<UserState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  }

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  setNewUser(user: User): void {
    this.localStorageService.setItem(LocalStorageKeys.user, JSON.stringify(user));
    this.setUserSuccess(user);
  }

  setUserStateFromLocalStorage(): void {
    const existingUser = localStorage.getItem(LocalStorageKeys.user);
    if (existingUser) {
      this.setUserSuccess(JSON.parse(existingUser));
    }
  }

  setUserSuccess(user: User): void {
    this.updateState({ user, error: undefined, status: RequestStatus.SUCCESS });
  }

  setErrorState(error: Error): void {
    this.updateState({ user: undefined, error, status: RequestStatus.ERROR });
  }

  refreshState(): void {
    this.localStorageService.removeItem(LocalStorageKeys.user);
    this.state.set(this.emptyState);
  }
}
