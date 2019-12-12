import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillsOfEmployeeComponent } from './edit-skills-of-employee.component';

describe('EditSkillsOfEmployeeComponent', () => {
  let component: EditSkillsOfEmployeeComponent;
  let fixture: ComponentFixture<EditSkillsOfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSkillsOfEmployeeComponent ]
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
