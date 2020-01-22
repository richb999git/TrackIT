import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStaffComponent } from '.././assign-staff.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../../app/show-errors/show-errors.component';  // added
import { PaginationComponent } from '../../../../app/pagination/pagination.component';  // added
import { CaseDisplaySupportComponent } from '../../case-display-support/case-display-support.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewMessagesComponent } from '../../../../app/Messages/view-messages/view-messages.component';  // added
import { FromToPipe } from '../../../../../src/pipes/from-to.pipe';  // added
import { UploadFilesComponent } from '../../../../app/FileUpload/upload-files/upload-files.component';  // added
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('AssignStaffComponent', () => {
  let component: AssignStaffComponent;
  let fixture: ComponentFixture<AssignStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, BsDatepickerModule.forRoot()],  // added
      declarations: [CaseDisplaySupportComponent, PaginationComponent, ShowErrorsComponent, AssignStaffComponent, ViewMessagesComponent, UploadFilesComponent, FromToPipe],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }, 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

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

  });

  

  it('should add employee to staff assigned to case list or remove if already on the list', () => {
    // user would be in the list of users (not possible to add/remove a user from assigned list who is not in the user list)

    // ARRANGE

    // create a users array - done in BeforeEach()

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
    expect(component.assignedStaff[0]).toEqual("a2");
    expect(component.assignedStaffNames[0]).toEqual("Jane Potter");

  });


  describe('Skills added to users', () => {

    beforeEach(() => {
      // create a employeesSkills array
      var employeeSkills1 = {
        id: 1, skillsId: 1, experience: 1, userId: "a1", user: null, skills: { id: 1, name: "C#", type: 1 }
      };
      var employeeSkills2 = {
        id: 2, skillsId: 2, experience: 2, userId: "a1", user: null, skills: { id: 2, name: "Javascript", type: 1 }
      };
      var employeeSkills3 = {
        id: 3, skillsId: 3, experience: 3, userId: "a1", user: null, skills: { id: 3, name: "Python", type: 1 }
      };
      var employeeSkills4 = {
        id: 4, skillsId: 4, experience: 2, userId: "a2", user: null, skills: { id: 4, name: "C", type: 1 }
      };
      var employeeSkills5 = {
        id: 5, skillsId: 2, experience: 2, userId: "a2", user: null, skills: { id: 2, name: "Javascript", type: 1 }
      };
      var employeeSkills6 = {
        id: 6, skillsId: 5, experience: 1, userId: "a2", user: null, skills: { id: 5, name: "PHP", type: 1 }
      };
      var employeeSkills7 = {
        id: 7, skillsId: 6, experience: 1, userId: "a2", user: null, skills: { id: 6, name: "Laravel", type: 2 }
      };
      var employeeSkills8 = {
        id: 8, skillsId: 7, experience: 2, userId: "a1", user: null, skills: { id: 7, name: "ASP.Net Core", type: 2 }
      };

      component['employeesSkills'] = [];
      component['employeesSkills'].push(employeeSkills1);
      component['employeesSkills'].push(employeeSkills2);
      component['employeesSkills'].push(employeeSkills3);
      component['employeesSkills'].push(employeeSkills4);
      component['employeesSkills'].push(employeeSkills5);
      component['employeesSkills'].push(employeeSkills6);
      component['employeesSkills'].push(employeeSkills7);
      component['employeesSkills'].push(employeeSkills8);

    });


    it('should create a new user array of objects that contains a new skills object for each user that contains all of their skills - All', () => {    
      // Properties of the Skills object are dynamic and created as needed

      // ARRANGE   
      // create a users array - done in BeforeEach() in above describe
      // create a employeesSkills array - done in BeforeEach() in this describe     

      // ACT
      component.populateUsersListWithSkillsAfterGettingEmployeeSkills();

      // ASSERT
      expect(component['allSkillsHeadings'].length).toBe(7);
      expect(component['allSkillsHeadings']).toEqual(["C#", "Javascript", "Python", "C", "PHP", "Laravel", "ASP.Net Core"]);

      expect(component.users.length).toBe(2);
      expect(component['usersWithSkills'].length).toBe(2);

      expect(component['usersWithSkills'][0].id).toBe("a1");
      expect(component['usersWithSkills'][0].firstName).toBe("John");
      expect(component['usersWithSkills'][0].lastName).toBe("Doe");
      expect(component['usersWithSkills'][0].skills['C#']).toBe(1);
      expect(component['usersWithSkills'][0].skills['Javascript']).toBe(2);
      expect(component['usersWithSkills'][0].skills['Python']).toBe(3);
      expect(component['usersWithSkills'][0].skills['C']).toBe(null);
      expect(component['usersWithSkills'][0].skills['PHP']).toBe(null);
      expect(component['usersWithSkills'][0].skills['Laravel']).toBe(null);
      expect(component['usersWithSkills'][0].skills['ASP.Net Core']).toBe(2);

      expect(component['usersWithSkills'][1].id).toBe("a2");
      expect(component['usersWithSkills'][1].firstName).toBe("Jane");
      expect(component['usersWithSkills'][1].lastName).toBe("Potter");
      expect(component['usersWithSkills'][1].skills['C#']).toBe(null);
      expect(component['usersWithSkills'][1].skills['Javascript']).toBe(2);
      expect(component['usersWithSkills'][1].skills['Python']).toBe(null);
      expect(component['usersWithSkills'][1].skills['C']).toBe(2);
      expect(component['usersWithSkills'][1].skills['PHP']).toBe(1);
      expect(component['usersWithSkills'][1].skills['Laravel']).toBe(1);
      expect(component['usersWithSkills'][1].skills['ASP.Net Core']).toBe(null);
    });


    it('should create a new user array of objects that contains a new skills object for each user that contains all of their skills - Just Frameworks', () => {
      // Properties of the Skills object are dynamic and created as needed

      // ARRANGE   
      // create a users array - done in BeforeEach() in above describe
      // create a employeesSkills array - done in BeforeEach() in this describe
      component['skillTypeFilter'] = 2;

      // ACT
      component.populateUsersListWithSkillsAfterGettingEmployeeSkills();

      // ASSERT
      expect(component['allSkillsHeadings'].length).toBe(2);
      expect(component['allSkillsHeadings']).toEqual(["Laravel", "ASP.Net Core"]);
      expect(component['usersWithSkills'].length).toBe(2);
      expect(component['usersWithSkills'][1].id).toBe("a2");
      expect(component['usersWithSkills'][1].firstName).toBe("Jane");
      expect(component['usersWithSkills'][1].lastName).toBe("Potter");
      expect(component['usersWithSkills'][1].skills['Laravel']).toBe(1);
      expect(component['usersWithSkills'][1].skills['ASP.Net Core']).toBe(null);
      expect(Object.keys(component['usersWithSkills'][1].skills).length).toEqual(2);
      expect(component['usersWithSkills'][0].id).toBe("a1");
      expect(component['usersWithSkills'][0].firstName).toBe("John");
      expect(component['usersWithSkills'][0].lastName).toBe("Doe");
      expect(component['usersWithSkills'][0].skills['Laravel']).toBe(null);
      expect(component['usersWithSkills'][0].skills['ASP.Net Core']).toBe(2);
    });

  })

  describe('Contact savings / retreiving', () => {

    it('Check getOldContact get correct info', () => {
      // ASSIGN
      component['caseContactIdOld'] = "B1";
      component['caseContactInfoIdOld'] = "B1";
      component['caseContactInfoFirstNameOld'] = "John";
      component['caseContactInfoLastNameOld'] = "Doe";
      component['caseContactInfoEmailOld'] = "john.doe@test.com";
      component['caseContactInfoUserNameOld'] = "JohnDoe1";

      // ACT
      component.getOldContact();

      // ASSERT
      expect(component['case']['contactId']).toBe("B1");
      expect(component['case']['contactInfo']['contactId']).toBe("B1");
      expect(component['case']['contactInfo']['firstName']).toBe("John");
      expect(component['case']['contactInfo']['lastName']).toBe("Doe");
      expect(component['case']['contactInfo']['email']).toBe("john.doe@test.com");
      expect(component['case']['contactInfo']['userName']).toBe("JohnDoe1");
    });

    it('Check saveOldContact saves correct info', () => {
      // ASSIGN
      component['case']['contactId'] = "B99";
      component['case']['contactInfo']['contactId'] = "B99";
      component['case']['contactInfo']['firstName'] = "Ben";
      component['case']['contactInfo']['lastName'] = "Moore";
      component['case']['contactInfo']['email'] = "ben.moore@test.com";
      component['case']['contactInfo']['userName'] = "BenMore99";

      // ACT
      component.saveOldContact();

      // ASSERT
      expect(component['caseContactIdOld']).toBe("B99");
      expect(component['caseContactInfoIdOld']).toBe("B99");
      expect(component['caseContactInfoFirstNameOld']).toBe("Ben");
      expect(component['caseContactInfoLastNameOld']).toBe("Moore");
      expect(component['caseContactInfoEmailOld']).toBe("ben.moore@test.com");
      expect(component['caseContactInfoUserNameOld']).toBe("BenMore99");
    });

    
    it('Check assignContact saves correct info', () => {
      // ASSIGN

      // ACT
      component.assignContact("B3", "Helen", "Jones", "hjones@test.com", "HJones1");

      // ASSERT
      expect(component['case']['contactId']).toBe("B3");
      expect(component['case']['contactInfo']['contactId']).toBe("B3");
      expect(component['case']['contactInfo']['firstName']).toBe("Helen");
      expect(component['case']['contactInfo']['lastName']).toBe("Jones");
      expect(component['case']['contactInfo']['email']).toBe("hjones@test.com");
      expect(component['case']['contactInfo']['userName']).toBe("HJones1");
    });

  });

  it('showAssignEmployeeSection sets the correct properties and emit - if deadline set', () => {
    // ASSIGN
    component['case']['deadline'] = new Date();
    spyOn(component.passDeadlineToSetMessage, 'emit');

    // ACT
    component.showAssignEmployeeSection("h");

    // ASSERT
    expect(component['deadlineToSetMessage']).toEqual(false);
    expect(component['assignStaffFlag']).toEqual(true);
    expect(component.passDeadlineToSetMessage.emit).toHaveBeenCalled();
    expect(component.passDeadlineToSetMessage.emit).toHaveBeenCalledWith(false);
  });

  it('showAssignEmployeeSection sets the correct properties and emit - if deadline NOT set', () => {
    // ASSIGN
    component['case']['deadline'] = null;
    spyOn(component.passDeadlineToSetMessage, 'emit');

    // ACT
    component.showAssignEmployeeSection("h");

    // ASSERT
    expect(component['deadlineToSetMessage']).toEqual(true);
    expect(component['assignStaffFlag']).toEqual(false);
    expect(component.passDeadlineToSetMessage.emit).toHaveBeenCalled();
    expect(component.passDeadlineToSetMessage.emit).toHaveBeenCalledWith(true);
  });


});



