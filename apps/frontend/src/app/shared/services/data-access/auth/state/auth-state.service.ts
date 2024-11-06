import { computed, inject, Injectable } from '@angular/core';
import { StatefulService } from '../../models/StatefulService';
import { RequestStatus } from '../../models/RequestStatus';
import { LocalStorageService } from '../../../common/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../../common/local-storage/models/LocalStorageKeys';
import { StateService } from '../../../common/state/state.service';
import { AuthState } from './models/AuthState';
import { emptyAuthState } from './models/EmptyAuthState';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService extends StateService<AuthState> implements StatefulService<AuthState> {
  private localStorageService = inject(LocalStorageService);

  isAuthenticated = computed(() => this.state().isAuthenticated);
  token = computed(() => this.state().token);

  constructor() {
    super({ state: emptyAuthState, emptyState: emptyAuthState });
    this.setUserAuthStateFromLocalStorage();
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

  refreshStateAndClearLocalStorage(): void {
    this.localStorageService.clear();
    this.refreshState();
  }
}
