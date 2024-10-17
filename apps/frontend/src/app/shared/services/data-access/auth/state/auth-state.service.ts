import { computed, Injectable, signal } from '@angular/core';
import { StatefulService } from '../../models/StatefulService';
import { RequestStatus } from '../../models/RequestStatus';

export interface AuthState {
  error: Error;
  status: RequestStatus;
  access_token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService implements StatefulService<AuthState> {

  emptyState: AuthState = {
    access_token: undefined,
    error: undefined,
    status: undefined,
  };

  // state
  readonly state = signal<AuthState>(this.emptyState);

  // selectors
  token = computed(() => this.state().access_token);
  status = computed(() => this.state().status);
  error = computed(() => this.state().error);

  updateState(state: Partial<AuthState>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  }

  setAccessTokenSuccess(accessToken: string): void {
    this.updateState({
      access_token: accessToken,
      error: undefined,
      status: RequestStatus.SUCCESS,
    });
  }

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING });
  }

  setErrorState(error: Error): void {
    this.updateState({ access_token: undefined, error, status: RequestStatus.ERROR });
  }

  refreshState(): void {
    this.state.set(this.emptyState)
  }
}
