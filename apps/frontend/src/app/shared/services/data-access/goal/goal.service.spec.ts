import { TestBed } from '@angular/core/testing';

import { GoalService } from './goal.service';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

describe('GoalService', () => {
  let service: GoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient)],
    });
    service = TestBed.inject(GoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
