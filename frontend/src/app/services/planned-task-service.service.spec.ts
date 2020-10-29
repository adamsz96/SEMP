import { TestBed } from '@angular/core/testing';

import { PlannedTaskServiceService } from './planned-task-service.service';

describe('PlannedTaskServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlannedTaskServiceService = TestBed.get(PlannedTaskServiceService);
    expect(service).toBeTruthy();
  });
});
