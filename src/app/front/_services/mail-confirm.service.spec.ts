import { TestBed } from '@angular/core/testing';

import { MailConfirmService } from './mail-confirm.service';

describe('MailConfirmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailConfirmService = TestBed.get(MailConfirmService);
    expect(service).toBeTruthy();
  });
});
