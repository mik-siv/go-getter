import { computed, inject, Injectable, signal } from '@angular/core';
import { StatefulService } from '../../models/StatefulService';
import { RequestStatus } from '../../models/RequestStatus';
import { LocalStorageService } from '../../../common/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../../common/local-storage/models/LocalStorageKeys';

export interface AuthState {
  error: Error;
  status: RequestStatus;
  isAuthenticated: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService implements StatefulService<AuthState> {
  private localStorageService = inject(LocalStorageService);

  emptyState: AuthState = {
    isAuthenticated: false,
    error: undefined,
    status: undefined,
    token: undefined,
  };

  // state
  readonly state = signal<AuthState>(this.emptyState);

  // selectors
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);
  isAuthenticated = computed(() => this.state().isAuthenticated);
  token = computed(() => this.state().token);

  constructor() {
    this.setUserAuthStateFromLocalStorage();
  }

  updateState(state: Partial<AuthState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  }

  setNewAccessToken(accessToken: string): void {
    this.localStorageService.setItem(LocalStorageKeys.accessToken, accessToken);
    this.setAccessTokenSuccess(accessToken);
  }

  setAccessTokenSuccess(accessToken: string): void {
    this.updateState({
      isAuthenticated: true,
      error: undefined,
      status: RequestStatus.SUCCESS,
      token: accessToken,
    });
  }

  setUserAuthStateFromLocalStorage(): void {
    const existingToken = this.localStorageService.getItem(LocalStorageKeys.accessToken);
    if (existingToken) {
      this.setAccessTokenSuccess(existingToken);
    }
  }

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  setErrorState(error: Error): void {
    this.updateState({ isAuthenticated: false, error, status: RequestStatus.ERROR });
  }

  refreshState(): void {
    this.localStorageService.clear();
    this.state.set(this.emptyState);
  }
}
