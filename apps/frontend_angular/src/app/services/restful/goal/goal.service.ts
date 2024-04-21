import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  goalsApiData = [{
    id: '1',
    name: 'first goal',
    subgoals: [{ name: '1st subgoal' }, { name: 'second subgoal' }],
  }, {
    id: '2',
    name: 'Become a Backend developer',
    subgoals: [{ name: '3rd subgoal' }, { name: '4th subgoal' }],
  }];

  constructor() { }

  getGoals(): Observable<any[]> {
    return of(this.goalsApiData);
  }
}
