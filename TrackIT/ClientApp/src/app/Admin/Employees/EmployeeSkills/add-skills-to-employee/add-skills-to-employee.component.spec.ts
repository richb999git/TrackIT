import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { AddSkillsToEmployeeComponent } from './add-skills-to-employee.component';
import { ShowErrorsComponent } from '../../../../../app/show-errors/show-errors.component';  // added

describe('AddSkillsToEmployeeComponent', () => {
  let component: AddSkillsToEmployeeComponent;
  let fixture: ComponentFixture<AddSkillsToEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [ShowErrorsComponent, AddSkillsToEmployeeComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillsToEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
