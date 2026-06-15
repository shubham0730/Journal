import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionModalComponent } from './decision-modal.component';

describe('DecisionModalComponent', () => {
  let component: DecisionModalComponent;
  let fixture: ComponentFixture<DecisionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
