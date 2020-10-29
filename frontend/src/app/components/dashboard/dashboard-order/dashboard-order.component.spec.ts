import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrderComponent } from './dashboard-order.component';

describe('DashboardOrderComponent', () => {
  let component: DashboardOrderComponent;
  let fixture: ComponentFixture<DashboardOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
