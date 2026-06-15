import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPapersComponent } from './review-papers.component';

describe('ReviewPapersComponent', () => {
  let component: ReviewPapersComponent;
  let fixture: ComponentFixture<ReviewPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewPapersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
