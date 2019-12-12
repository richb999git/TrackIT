import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillsToEmployeeComponent } from './add-skills-to-employee.component';

describe('AddSkillsToEmployeeComponent', () => {
  let component: AddSkillsToEmployeeComponent;
  let fixture: ComponentFixture<AddSkillsToEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSkillsToEmployeeComponent ]
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
