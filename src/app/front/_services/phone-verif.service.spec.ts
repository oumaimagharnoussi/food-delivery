import { TestBed } from '@angular/core/testing';

import { PhoneVerifService } from './phone-verif.service';

describe('PhoneVerifService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhoneVerifService = TestBed.get(PhoneVerifService);
    expect(service).toBeTruthy();
  });
});
