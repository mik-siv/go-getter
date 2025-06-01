import { TestBed } from '@angular/core/testing';

import { SubgoalStateService } from './subgoal-state.service';

describe('SubgoalStateService', () => {
  let service: SubgoalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubgoalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
