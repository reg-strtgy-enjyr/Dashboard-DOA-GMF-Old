import { TestBed } from '@angular/core/testing';

import { IorServiceService } from './ior-service.service';

describe('IorServiceService', () => {
  let service: IorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
