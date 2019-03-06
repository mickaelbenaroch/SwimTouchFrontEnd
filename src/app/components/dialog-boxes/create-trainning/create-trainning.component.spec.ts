import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainningComponent } from './create-trainning.component';

describe('CreateTrainningComponent', () => {
  let component: CreateTrainningComponent;
  let fixture: ComponentFixture<CreateTrainningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrainningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
