import { TestBed } from '@angular/core/testing';

import { RestfulService } from './restful.service';

describe('CrudService', () => {
  let service: RestfulService<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestfulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
