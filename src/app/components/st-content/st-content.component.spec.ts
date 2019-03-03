import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StContentComponent } from './st-content.component';

describe('StContentComponent', () => {
  let component: StContentComponent;
  let fixture: ComponentFixture<StContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
