import { TestBed } from '@angular/core/testing';

import { TrolleyService } from './trolley.service';

describe('TrolleyService', () => {
  let service: TrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
