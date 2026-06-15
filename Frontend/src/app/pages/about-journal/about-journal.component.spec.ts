import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutJournalComponent } from './about-journal.component';

describe('AboutJournalComponent', () => {
  let component: AboutJournalComponent;
  let fixture: ComponentFixture<AboutJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
