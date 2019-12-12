import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkillsOfEmployeeComponent } from './view-skills-of-employee.component';

describe('ViewSkillsOfEmployeeComponent', () => {
  let component: ViewSkillsOfEmployeeComponent;
  let fixture: ComponentFixture<ViewSkillsOfEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSkillsOfEmployeeComponent ]
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
