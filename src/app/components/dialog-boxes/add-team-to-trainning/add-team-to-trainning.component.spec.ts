import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamToTrainningComponent } from './add-team-to-trainning.component';

describe('AddTeamToTrainningComponent', () => {
  let component: AddTeamToTrainningComponent;
  let fixture: ComponentFixture<AddTeamToTrainningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamToTrainningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamToTrainningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
