import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStaffComponent } from './assign-staff.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../app/show-errors/show-errors.component';  // added
import { PaginationComponent } from '../../../app/pagination/pagination.component';  // added
import { CaseDisplaySupportComponent } from '../case-display-support/case-display-support.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewMessagesComponent } from '../../../app/Messages/view-messages/view-messages.component';  // added
import { FromToPipe } from '../../../../src/pipes/from-to.pipe';  // added
import { UploadFilesComponent } from '../../../app/FileUpload/upload-files/upload-files.component';  // added
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('AssignStaffComponent', () => {
  let component: AssignStaffComponent;
  let fixture: ComponentFixture<AssignStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, BsDatepickerModule.forRoot()],  // added
      declarations: [CaseDisplaySupportComponent, PaginationComponent, ShowErrorsComponent, AssignStaffComponent, ViewMessagesComponent, UploadFilesComponent, FromToPipe],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add employee to staff assigned to case list or remove if already on the list', () => {
    // user would be in the list of users (not possible to add/remove a user from assigned list who is not in the user list)

    // ARRANGE
    var user1 = {
      contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
      isManager: null, id: "a1", find: null
    };
    var user2 = {
      contactId: null, firstName: "Jane", lastName: "Potter", email: null, userName: null,
      isManager: null, id: "a2", find: null
    };

    component.users = [];
    component.users.push(user1);
    component.users.push(user2);
    component.assignedStaff = [];
    component.assignedStaffNames = [];

    // ACT
    // add
    component.assignEmployee("a1");

    // ASSERT
    expect(component.assignedStaff.length).toBe(1);
    expect(component.assignedStaffNames.length).toBe(1);
    expect(component.assignedStaff[0]).toContain("a1");
    expect(component.assignedStaffNames[0]).toContain("John Doe");

    // ACT
    // remove
    component.assignEmployee("a1");

    // ASSERT
    expect(component.assignedStaff).toEqual([]);
    expect(component.assignedStaffNames).toEqual([]);

    // ACT
    // add again
    component.assignEmployee("a2");

    // ASSERT
    expect(component.assignedStaff.length).toBe(1);
    expect(component.assignedStaffNames.length).toBe(1);
    expect(component.assignedStaff[0]).toContain("a2");
    expect(component.assignedStaffNames[0]).toContain("Jane Potter");

    // ACT
    // add again
    component.assignEmployee("a1");

    // ASSERT
    expect(component.assignedStaff.length).toBe(2);
    expect(component.assignedStaffNames.length).toBe(2);
    expect(component.assignedStaff[1]).toContain("a1");
    expect(component.assignedStaffNames[1]).toContain("John Doe");

    // ACT
    // remove again
    component.assignEmployee("a1");
    // ASSERT
    expect(component.assignedStaff.length).toBe(1);
    expect(component.assignedStaffNames.length).toBe(1);
    expect(component.assignedStaff[0]).not.toContain("a1");
    expect(component.assignedStaffNames[0]).not.toContain("John Doe");

  });



});



