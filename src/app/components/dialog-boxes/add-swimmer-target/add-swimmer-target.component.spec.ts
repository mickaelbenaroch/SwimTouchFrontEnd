import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSwimmerTargetComponent } from './add-swimmer-target.component';

describe('AddSwimmerTargetComponent', () => {
  let component: AddSwimmerTargetComponent;
  let fixture: ComponentFixture<AddSwimmerTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSwimmerTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSwimmerTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
