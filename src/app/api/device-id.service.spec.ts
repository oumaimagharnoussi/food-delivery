import { TestBed } from '@angular/core/testing';

import { DeviceIdService } from './device-id.service';

describe('DeviceIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceIdService = TestBed.get(DeviceIdService);
    expect(service).toBeTruthy();
  });
});
