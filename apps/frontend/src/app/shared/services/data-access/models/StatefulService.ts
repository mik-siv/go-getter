import { Signal } from '@angular/core';
import { RequestStatus } from './RequestStatus';

export interface StatefulService<T> {
  /**
   * Represents the full state of a given entity.
   * @readonly
   * @template T
   */
  state: Signal<T>;
  /**
   * Represents the state of received errors.
   * @type {Signal<Error>}
   */
  error: Signal<Error>;
  /**
   * Represents the status of a request.
   * @type {Signal<RequestStatus>}
   */
  status: Signal<RequestStatus>;

  /**
   * Updates the state with the provided partial state object.
   * @template T
   * @param state{Partial<T>} - The partial state object containing properties to update.
   * @return - This method does not return anything.
   */
  updateState(state: Partial<T>): void;

  /**
   * Sets the pending state of the API request.
   * @return {void}
   */
  setPendingState(): void;

  /**
   * Sets the error state of the API request.
   * @return {void}
   */
  setErrorState(error: Error): void;

  /**
   * Refreshes the state of the given entity.
   * @return {void} - This method does not return any value.
   */
  refreshState(): void;
}
