import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummySubmitComponent } from './dummy-submit.component';

describe('DummySubmitComponent', () => {
  let component: DummySubmitComponent;
  let fixture: ComponentFixture<DummySubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummySubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummySubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
