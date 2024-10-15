import { TestBed } from '@angular/core/testing';

import { BancoUnionService } from './banco-union.service';

describe('BancoUnionService', () => {
  let service: BancoUnionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BancoUnionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
