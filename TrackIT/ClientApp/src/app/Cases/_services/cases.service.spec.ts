import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';  // added
import { CasesService } from './cases.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CasesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],  // added
    providers: [
      { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
    ]   // added, not sure this will work for actual mocking later though
  }));

  it('should be created', () => {
    const service: CasesService = TestBed.get(CasesService);
    expect(service).toBeTruthy();
  });
});
