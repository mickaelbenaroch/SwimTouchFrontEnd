import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StHeaderComponent } from './st-header.component';

describe('StHeaderComponent', () => {
  let component: StHeaderComponent;
  let fixture: ComponentFixture<StHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
