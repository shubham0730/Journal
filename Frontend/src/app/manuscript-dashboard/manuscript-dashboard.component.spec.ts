import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptDashboardComponent } from './manuscript-dashboard.component';

describe('ManuscriptDashboardComponent', () => {
  let component: ManuscriptDashboardComponent;
  let fixture: ComponentFixture<ManuscriptDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
