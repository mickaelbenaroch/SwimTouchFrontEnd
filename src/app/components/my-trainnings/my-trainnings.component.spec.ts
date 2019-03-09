import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTrainningsComponent } from './my-trainnings.component';

describe('MyTrainningsComponent', () => {
  let component: MyTrainningsComponent;
  let fixture: ComponentFixture<MyTrainningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTrainningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTrainningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
