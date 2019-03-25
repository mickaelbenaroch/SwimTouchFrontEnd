import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvModeComponent } from './tv-mode.component';

describe('TvModeComponent', () => {
  let component: TvModeComponent;
  let fixture: ComponentFixture<TvModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
