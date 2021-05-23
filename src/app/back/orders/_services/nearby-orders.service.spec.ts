import { TestBed } from '@angular/core/testing';

import { NearbyOrdersService } from './nearby-orders.service';

describe('NearbyOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NearbyOrdersService = TestBed.get(NearbyOrdersService);
    expect(service).toBeTruthy();
  });
});
