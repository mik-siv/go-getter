import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  goalsApiData = [{
    id: '1',
    name: 'first goal',
    subgoals: [{ id: '1', name: '1st subgoal', description: '1st subgoal description' }, {
      id: '2',
      name: 'second subgoal',
      description: '2nd subgoal description',
    }],
  }, {
    id: '2',
    name: 'Become a Backend developer',
    subgoals: [{ id: '3', name: '3rd subgoal', description: '3rd subgoal description' }, {
      id: '4',
      name: '4th subgoal',
      description: '4th subgoal description',
    }],
  }];

  constructor() {
  }

  getGoals(): Observable<any[]> {
    return of(this.goalsApiData);
  }
}
