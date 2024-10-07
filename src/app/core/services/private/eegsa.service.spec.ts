import { TestBed } from '@angular/core/testing';

import { EegsaService } from './eegsa.service';

describe('EegsaService', () => {
  let service: EegsaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EegsaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
