import { TestBed } from '@angular/core/testing';

import { ListoftrolleyService } from './listoftrolley.service';

describe('ListoftrolleyService', () => {
  let service: ListoftrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListoftrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
