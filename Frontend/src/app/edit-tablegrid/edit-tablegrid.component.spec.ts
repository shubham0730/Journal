import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTablegridComponent } from './edit-tablegrid.component';

describe('EditTablegridComponent', () => {
  let component: EditTablegridComponent;
  let fixture: ComponentFixture<EditTablegridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTablegridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTablegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
