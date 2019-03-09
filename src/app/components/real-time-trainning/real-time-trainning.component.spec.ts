import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeTrainningComponent } from './real-time-trainning.component';

describe('RealTimeTrainningComponent', () => {
  let component: RealTimeTrainningComponent;
  let fixture: ComponentFixture<RealTimeTrainningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeTrainningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeTrainningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
