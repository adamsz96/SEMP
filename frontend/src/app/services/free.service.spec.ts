import { TestBed } from '@angular/core/testing';

import { FreeService } from './free.service';

describe('FreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreeService = TestBed.get(FreeService);
    expect(service).toBeTruthy();
  });
});
