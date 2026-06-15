import { TestBed } from '@angular/core/testing';

import { ManuscriptService } from './manuscript-details.service';

describe('ManuscriptDetailsService', () => {
  let service: ManuscriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManuscriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
