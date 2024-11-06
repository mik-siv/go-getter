import { computed, inject, Injectable } from '@angular/core';
import { RequestStatus } from '../../models/RequestStatus';
import { StatefulService } from '../../models/StatefulService';
import { User } from '../models/user.model';
import { LocalStorageService } from '../../../common/local-storage/local-storage.service';
import { LocalStorageKeys } from '../../../common/local-storage/models/LocalStorageKeys';
import { StateService } from '../../../common/state/state.service';
import { UserState } from './models/UserState';
import { emptyUserState } from './models/EmptyUserState';


@Injectable({
  providedIn: 'root',
})
export class UserStateService extends StateService<UserState> implements StatefulService<UserState> {
  private localStorageService = inject(LocalStorageService);

  //selectors
  user = computed(() => this.state().user);

  constructor() {
    super({ state: emptyUserState, emptyState: emptyUserState });
    this.setUserStateFromLocalStorage();
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

  refreshStateAndRemoveUserFromLocalStorage(): void {
    this.localStorageService.removeItem(LocalStorageKeys.user);
    this.refreshState();
  }
}
