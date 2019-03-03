import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StSidenavComponent } from './st-sidenav.component';

describe('StSidenavComponent', () => {
  let component: StSidenavComponent;
  let fixture: ComponentFixture<StSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
