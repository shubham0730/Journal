import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDialogComponent } from './reviewer-dialog.component';

describe('ReviewerDialogComponent', () => {
  let component: ReviewerDialogComponent;
  let fixture: ComponentFixture<ReviewerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
