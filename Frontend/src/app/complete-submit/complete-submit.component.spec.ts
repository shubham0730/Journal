import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSubmitComponent } from './complete-submit.component';

describe('CompleteSubmitComponent', () => {
  let component: CompleteSubmitComponent;
  let fixture: ComponentFixture<CompleteSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
