import { TestBed } from '@angular/core/testing';

import { AddnewtrolleyService } from './addnewtrolley.service';

describe('AddnewtrolleyService', () => {
  let service: AddnewtrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddnewtrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
