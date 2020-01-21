import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // added
import { AuthorizeGuard } from './authorize.guard';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthorizeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // added
      providers: [AuthorizeGuard, { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should ...', inject([AuthorizeGuard], (guard: AuthorizeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
