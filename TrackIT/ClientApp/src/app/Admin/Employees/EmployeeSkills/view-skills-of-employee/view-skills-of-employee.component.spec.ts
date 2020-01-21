import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ViewSkillsOfEmployeeComponent } from './view-skills-of-employee.component';
import { ShowErrorsComponent } from '../../../../../app/show-errors/show-errors.component';
import { ModalModule } from 'ngx-bootstrap/modal';

describe('ViewSkillsOfEmployeeComponent', () => {
  let component: ViewSkillsOfEmployeeComponent;
  let fixture: ComponentFixture<ViewSkillsOfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ModalModule.forRoot()],  // added
      declarations: [ShowErrorsComponent, ViewSkillsOfEmployeeComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSkillsOfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
