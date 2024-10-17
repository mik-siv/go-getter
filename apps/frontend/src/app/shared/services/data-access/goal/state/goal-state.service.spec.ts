import { TestBed } from '@angular/core/testing';

import { GoalStateService } from './goal-state.service';

describe('GoalStateService', () => {
  let service: GoalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
