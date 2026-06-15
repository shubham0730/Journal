import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitManuscriptInstitutionDetailsComponent } from './submit-manuscript-institution-details.component';

describe('SubmitManuscriptInstitutionDetailsComponent', () => {
  let component: SubmitManuscriptInstitutionDetailsComponent;
  let fixture: ComponentFixture<SubmitManuscriptInstitutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitManuscriptInstitutionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitManuscriptInstitutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
