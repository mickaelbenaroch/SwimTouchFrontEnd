import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBoxComponent } from './schedule-box.component';

describe('ScheduleBoxComponent', () => {
  let component: ScheduleBoxComponent;
  let fixture: ComponentFixture<ScheduleBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
