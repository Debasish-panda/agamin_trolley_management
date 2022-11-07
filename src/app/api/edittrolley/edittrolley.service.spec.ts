import { TestBed } from '@angular/core/testing';

import { EdittrolleyService } from './edittrolley.service';

describe('EdittrolleyService', () => {
  let service: EdittrolleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdittrolleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
