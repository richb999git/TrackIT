import { TestBed, inject } from '@angular/core/testing';
import { AuthorizeService } from './authorize.service';
import { RouterTestingModule } from '@angular/router/testing'; // added
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthorizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule], // added
      providers: [AuthorizeService, { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }],
      schemas: [NO_ERRORS_SCHEMA]
    });   
  });

  it('should be created', inject([AuthorizeService], (service: AuthorizeService) => {
    expect(service).toBeTruthy();
  }));
});
