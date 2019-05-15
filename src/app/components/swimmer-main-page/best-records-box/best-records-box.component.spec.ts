import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestRecordsBoxComponent } from './best-records-box.component';

describe('BestRecordsBoxComponent', () => {
  let component: BestRecordsBoxComponent;
  let fixture: ComponentFixture<BestRecordsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestRecordsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestRecordsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
