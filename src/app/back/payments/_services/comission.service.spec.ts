import { TestBed } from '@angular/core/testing';

import { ComissionService } from './comission.service';

describe('ComissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComissionService = TestBed.get(ComissionService);
    expect(service).toBeTruthy();
  });
});
