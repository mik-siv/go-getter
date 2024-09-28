import { TestBed } from '@angular/core/testing';

import { RestfulService } from './restful.service';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

describe('CrudService', () => {
  let service: RestfulService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient)],
    });
    service = TestBed.inject(RestfulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
