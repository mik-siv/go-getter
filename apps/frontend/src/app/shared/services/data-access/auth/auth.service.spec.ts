import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient)],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
