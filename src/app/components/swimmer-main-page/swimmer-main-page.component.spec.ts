import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmerMainPageComponent } from './swimmer-main-page.component';

describe('SwimmerMainPageComponent', () => {
  let component: SwimmerMainPageComponent;
  let fixture: ComponentFixture<SwimmerMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmerMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
