import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadManuscriptComponent } from './upload-manuscript.component';

describe('UploadManuscriptComponent', () => {
  let component: UploadManuscriptComponent;
  let fixture: ComponentFixture<UploadManuscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadManuscriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadManuscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
