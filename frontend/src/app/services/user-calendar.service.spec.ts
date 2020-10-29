import { TestBed } from '@angular/core/testing';

import { UserCalendarService } from './user-calendar.service';

describe('UserCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserCalendarService = TestBed.get(UserCalendarService);
    expect(service).toBeTruthy();
  });
});
