import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListElementComponent } from './client.list.element.component';

describe('Client.List.ElementComponent', () => {
  let component: ClientListElementComponent;
  let fixture: ComponentFixture<ClientListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
