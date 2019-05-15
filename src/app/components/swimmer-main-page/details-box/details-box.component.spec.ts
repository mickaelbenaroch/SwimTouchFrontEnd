import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBoxComponent } from './details-box.component';

describe('DetailsBoxComponent', () => {
  let component: DetailsBoxComponent;
  let fixture: ComponentFixture<DetailsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
