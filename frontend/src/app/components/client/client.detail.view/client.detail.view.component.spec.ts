import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Client.Detail.ViewComponent } from './client.detail.view.component';

describe('Client.Detail.ViewComponent', () => {
  let component: Client.Detail.ViewComponent;
  let fixture: ComponentFixture<Client.Detail.ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Client.Detail.ViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Client.Detail.ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
