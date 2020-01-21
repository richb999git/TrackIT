import { TestBed, inject } from '@angular/core/testing';
import { AuthorizeInterceptor } from './authorize.interceptor';
import { RouterTestingModule } from '@angular/router/testing'; // added
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthorizeInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // added
      providers: [AuthorizeInterceptor, { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should be created', inject([AuthorizeInterceptor], (service: AuthorizeInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
