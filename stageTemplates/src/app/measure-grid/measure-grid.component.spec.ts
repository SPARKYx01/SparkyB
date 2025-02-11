import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureGridComponent } from './measure-grid.component';

describe('MeasureGridComponent', () => {
  let component: MeasureGridComponent;
  let fixture: ComponentFixture<MeasureGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeasureGridComponent]
    });
    fixture = TestBed.createComponent(MeasureGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
