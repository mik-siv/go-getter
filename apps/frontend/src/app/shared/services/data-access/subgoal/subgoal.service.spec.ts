import { TestBed } from '@angular/core/testing';

import { SubgoalService } from './subgoal.service';

describe('SubgoalService', () => {
  let service: SubgoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubgoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
