import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentIssueComponent } from './current-issue.component';

describe('CurrentIssueComponent', () => {
  let component: CurrentIssueComponent;
  let fixture: ComponentFixture<CurrentIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
