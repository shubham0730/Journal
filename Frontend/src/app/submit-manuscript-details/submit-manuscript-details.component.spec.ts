import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitManuscriptDetailsComponent } from './submit-manuscript-details.component';

describe('SubmitManuscriptDetailsComponent', () => {
  let component: SubmitManuscriptDetailsComponent;
  let fixture: ComponentFixture<SubmitManuscriptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitManuscriptDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitManuscriptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
