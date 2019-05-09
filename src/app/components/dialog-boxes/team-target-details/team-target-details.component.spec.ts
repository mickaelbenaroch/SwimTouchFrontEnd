import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTargetDetailsComponent } from './team-target-details.component';

describe('TeamTargetDetailsComponent', () => {
  let component: TeamTargetDetailsComponent;
  let fixture: ComponentFixture<TeamTargetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTargetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTargetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
