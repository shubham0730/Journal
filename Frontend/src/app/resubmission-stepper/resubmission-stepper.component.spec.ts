import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubmissionStepperComponent } from './resubmission-stepper.component';

describe('ResubmissionStepperComponent', () => {
  let component: ResubmissionStepperComponent;
  let fixture: ComponentFixture<ResubmissionStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResubmissionStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResubmissionStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
