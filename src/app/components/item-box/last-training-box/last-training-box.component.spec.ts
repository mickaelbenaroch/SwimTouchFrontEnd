import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTrainingBoxComponent } from './last-training-box.component';

describe('LastTrainingBoxComponent', () => {
  let component: LastTrainingBoxComponent;
  let fixture: ComponentFixture<LastTrainingBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastTrainingBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastTrainingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
