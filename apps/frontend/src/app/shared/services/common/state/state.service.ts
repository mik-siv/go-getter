import { computed, Injectable, Signal, signal } from '@angular/core';
import { StatefulService } from '../../data-access/models/StatefulService';
import { RequestStatus } from '../../data-access/models/RequestStatus';
import { StateInput } from './models/StateInput';
import { GenericState } from './models/GenericState';

@Injectable({
  providedIn: 'root',
})
export abstract class StateService<T extends GenericState> implements StatefulService<T> {
  readonly state = signal<T>(null);
  error: Signal<Error> = computed(() => this.state()?.error);
  status: Signal<RequestStatus> = computed(() => this.state()?.status);
  emptyState: T;

  protected constructor(stateInput: StateInput<T>) {
    this.emptyState = stateInput.emptyState;
    this.state.set(stateInput.state);
  }

  refreshState(): void {
    this.state.set(this.emptyState);
  }

  setErrorState(error: Error): void {
    this.updateState({ ...this.emptyState, error });
  }

  setPendingState(): void {
    this.updateState({ status: RequestStatus.PENDING } as Partial<T>);
  }

  setSuccessState(): void {
    this.updateState({ status: RequestStatus.SUCCESS } as Partial<T>);
  }

  updateState(state: Partial<T>): void {
    this.state.update(currentState => ({ ...currentState, ...state }));
  }

}
