import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatalotsComponent } from './matalots.component';

describe('MatalotsComponent', () => {
  let component: MatalotsComponent;
  let fixture: ComponentFixture<MatalotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatalotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatalotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
