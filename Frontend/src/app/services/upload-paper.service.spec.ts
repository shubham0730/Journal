import { TestBed } from '@angular/core/testing';

import { UploadPaperService } from './upload-paper.service';

describe('UploadPaperService', () => {
  let service: UploadPaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadPaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
