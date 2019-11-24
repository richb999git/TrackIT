import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAssignStaffComponent } from './case-assign-staff.component';

describe('CaseAssignStaffComponent', () => {
  let component: CaseAssignStaffComponent;
  let fixture: ComponentFixture<CaseAssignStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseAssignStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAssignStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
