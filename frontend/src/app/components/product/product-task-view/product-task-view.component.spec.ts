import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTaskViewComponent } from './product-task-view.component';

describe('ProductTaskViewComponent', () => {
  let component: ProductTaskViewComponent;
  let fixture: ComponentFixture<ProductTaskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTaskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
