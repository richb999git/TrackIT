import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { EditSkillsOfEmployeeComponent } from './edit-skills-of-employee.component';
import { ShowErrorsComponent } from '../../../../../app/show-errors/show-errors.component';  // added

describe('EditSkillsOfEmployeeComponent', () => {
  let component: EditSkillsOfEmployeeComponent;
  let fixture: ComponentFixture<EditSkillsOfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [ShowErrorsComponent, EditSkillsOfEmployeeComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillsOfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
