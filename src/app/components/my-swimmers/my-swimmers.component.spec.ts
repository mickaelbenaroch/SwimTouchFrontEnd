import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySwimmersComponent } from './my-swimmers.component';

describe('MySwimmersComponent', () => {
  let component: MySwimmersComponent;
  let fixture: ComponentFixture<MySwimmersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySwimmersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySwimmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
