import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfiliatedSocietyComponent } from './afiliated-society.component';

describe('AfiliatedSocietyComponent', () => {
  let component: AfiliatedSocietyComponent;
  let fixture: ComponentFixture<AfiliatedSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfiliatedSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfiliatedSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
