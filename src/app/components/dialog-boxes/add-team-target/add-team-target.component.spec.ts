import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamTargetComponent } from './add-team-target.component';

describe('AddTeamTargetComponent', () => {
  let component: AddTeamTargetComponent;
  let fixture: ComponentFixture<AddTeamTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
