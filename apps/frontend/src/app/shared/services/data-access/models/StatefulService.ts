import { Signal } from '@angular/core';
import { RequestStatus } from './RequestStatus';

export interface StatefulService {
  error: Signal<Error>;
  status: Signal<RequestStatus>;
}
