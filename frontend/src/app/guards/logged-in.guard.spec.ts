import { TestBed, async, inject } from '@angular/core/testing';

import { LogedInGuard } from './logged-in.guard';

describe('LogedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogedInGuard]
    });
  });

  it('should ...', inject([LogedInGuard], (guard: LogedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
