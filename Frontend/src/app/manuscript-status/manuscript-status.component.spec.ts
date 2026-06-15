import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptStatusComponent } from './manuscript-status.component';

describe('ManuscriptStatusComponent', () => {
  let component: ManuscriptStatusComponent;
  let fixture: ComponentFixture<ManuscriptStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
