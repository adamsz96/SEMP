import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCostTableComponent } from './order-cost-table.component';

describe('NewOrderCostTableComponent', () => {
  let component: OrderCostTableComponent;
  let fixture: ComponentFixture<OrderCostTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCostTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCostTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
