import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUpdateComponent } from './picture-update.component';

describe('PictureUpdateComponent', () => {
  let component: PictureUpdateComponent;
  let fixture: ComponentFixture<PictureUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
