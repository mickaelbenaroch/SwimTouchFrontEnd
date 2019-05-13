import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmerBoxComponent } from './swimmer-box.component';

describe('SwimmerBoxComponent', () => {
  let component: SwimmerBoxComponent;
  let fixture: ComponentFixture<SwimmerBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmerBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
