import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedTaskDetailsComponent } from './planned-task-details.component';

describe('PlannedTaskDetailsComponent', () => {
  let component: PlannedTaskDetailsComponent;
  let fixture: ComponentFixture<PlannedTaskDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedTaskDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
