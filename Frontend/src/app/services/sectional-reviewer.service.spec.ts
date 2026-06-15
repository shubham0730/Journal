import { TestBed } from '@angular/core/testing';

import { SectionalReviewerService } from './sectional-reviewer.service';

describe('SectionalReviewerService', () => {
  let service: SectionalReviewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionalReviewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
