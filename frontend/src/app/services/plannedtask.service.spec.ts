import { TestBed } from '@angular/core/testing';

import { PlannedtaskService } from './plannedtask.service';

describe('PlannedtaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlannedtaskService = TestBed.get(PlannedtaskService);
    expect(service).toBeTruthy();
  });
});
