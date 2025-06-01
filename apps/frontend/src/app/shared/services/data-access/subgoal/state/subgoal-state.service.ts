import { Injectable } from '@angular/core';
import { StateService } from '../../../common/state/state.service';
import { SubgoalState } from './models/SubgoalState';
import { emptySubgoalState } from './models/EmptySubgoalState';

@Injectable({
  providedIn: 'root'
})
export class SubgoalStateService extends StateService<SubgoalState>{

  constructor() {
    super({state: emptySubgoalState, emptyState: emptySubgoalState});
  }
}
