import { TestBed } from '@angular/core/testing';

import { NCRServiceService } from './ncrservice.service';

describe('NCRServiceService', () => {
  let service: NCRServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NCRServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
