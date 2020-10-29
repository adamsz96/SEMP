import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderScheduleTableComponent } from './order-schedule-table.component';

describe('OrderScheduleTableComponent', () => {
  let component: OrderScheduleTableComponent;
  let fixture: ComponentFixture<OrderScheduleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderScheduleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderScheduleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
