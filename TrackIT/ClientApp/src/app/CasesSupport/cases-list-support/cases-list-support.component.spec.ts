import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CasesListSupportComponent } from './cases-list-support.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../app/show-errors/show-errors.component';  // added
import { PaginationComponent } from '../../../app/pagination/pagination.component';  // added

describe('CasesListSupportComponent', () => {
  let component: CasesListSupportComponent;
  let fixture: ComponentFixture<CasesListSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [PaginationComponent, ShowErrorsComponent, CasesListSupportComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesListSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
