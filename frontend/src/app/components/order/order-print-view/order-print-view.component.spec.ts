import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintViewComponent } from './order-print-view.component';

describe('OrderPrintViewComponent', () => {
  let component: OrderPrintViewComponent;
  let fixture: ComponentFixture<OrderPrintViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPrintViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
