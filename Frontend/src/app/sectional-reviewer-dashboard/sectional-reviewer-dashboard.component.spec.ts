import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionalReviewerDashboardComponent } from './sectional-reviewer-dashboard.component';

describe('SectionalReviewerDashboardComponent', () => {
  let component: SectionalReviewerDashboardComponent;
  let fixture: ComponentFixture<SectionalReviewerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionalReviewerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionalReviewerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
