import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { Observable, of } from 'rxjs';


describe('AssignStaffComponent', () => {
  let component: AssignStaffComponent;
  let fixture: ComponentFixture<AssignStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, BsDatepickerModule.forRoot()],  // added
      //declarations: [CaseDisplaySupportComponent, PaginationComponent, ShowErrorsComponent, AssignStaffComponent, ViewMessagesComponent, UploadFilesComponent, FromToPipe], 
      declarations: [PaginationComponent, ShowErrorsComponent, AssignStaffComponent], 
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


  describe('Assign button and messages displayed/hidden based on various setting', () => {

    beforeEach(() => {
      component['assignStaffFlag'] = false; // i.e assigning section not open
    });


    it('should show nothing to allow user to assign staff if user is not a manager', fakeAsync(() => {
      // ARRANGE
      var mockRoles = ["employee"];

      function getUserRole(): Observable<string[]> {
        return of(mockRoles);
      }

      component['deadlineToSetMessage'] = true; // i.e. whether deadline has been set - required before manager can assign staff


      // ACT
      component['userRole'] = getUserRole();

      // ASSERT
      tick(1);
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('#assignStaffQuery');
      expect(a).toEqual(null);
    }));

    it('should show message to enter a deadline if it has NOT been set and manager attempts to assign staff', fakeAsync(() => {
      // ARRANGE
      var mockRoles = ["employee", "admin", "manager"];

      function getUserRole(): Observable<string[]> {
        return of(mockRoles);
      }

      component['deadlineToSetMessage'] = true; // i.e. whether deadline has been set - required before manager can assign staff
    

      // ACT
      component['userRole'] = getUserRole();

      // ASSERT
      tick(1);
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('#assignStaffQuery');
      const c = a.children[0];
      const c1 = a.firstChild.firstChild;
      const c2 = a.getElementsByTagName('p')[0];
      expect(c.textContent).toContain("enter a deadline");
    }));


    it('should show button with "Adjust assigned staff" if assignStaffFlag is not set and user is a manager and deadline has been set and staff ALREADY assigned', fakeAsync(() => {
      // ARRANGE
      var mockRoles = ["employee", "admin", "manager"];

      function getUserRole(): Observable<string[]> {
        return of(mockRoles);
      }

      component['deadlineToSetMessage'] = false; // i.e. whether deadline has been set - required before manager can assign staff
      component['case']['dateAssigned'] = new Date();

      // ACT
      component['userRole'] = getUserRole();

      // ASSERT
      tick(1);
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('#assignStaffQuery');
      const c = a.children[0];
      expect(a.textContent).toContain("Adjust assigned staff");
      expect(c.textContent).not.toContain("enter a deadline");
    }));


    it('should show button with "Assign staff" if assignStaffFlag is not set and user is a manager and deadline has been set and staff NOT already assigned', fakeAsync(() => {
      // ARRANGE
      var mockRoles = ["employee", "admin", "manager"];

      function getUserRole(): Observable<string[]> {
        return of(mockRoles);
      }

      component['deadlineToSetMessage'] = false; // i.e. whether deadline has been set - required before manager can assign staff
      component['case']['dateAssigned'] = null;

      // ACT
      component['userRole'] = getUserRole();

      // ASSERT
      tick(1);
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('#assignStaffQuery');
      const c = a.children[0];
      expect(a.textContent).toContain("Assign staff");
      expect(c.textContent).not.toContain("enter a deadline");
    }));

    it('should set assignStaffFlag to true when Assign staff button clicked', fakeAsync(() => {
      // ARRANGE
      var mockRoles = ["employee", "admin", "manager"];

      function getUserRole(): Observable<string[]> {
        return of(mockRoles);
      }

      component['deadlineToSetMessage'] = false; // i.e. whether deadline has been set - required before manager can assign staff
      component['case']['deadline'] = new Date(); // force deadline date so button can be clicked

      // ACT
      component['userRole'] = getUserRole();

      // ASSERT
      tick(1);
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('#assignStaffQuery');
      const c = a.getElementsByTagName('button')[0];
      c.click();
      fixture.detectChanges();
      expect(a.textContent).toContain("Assign staff");
      expect(component['assignStaffFlag']).toEqual(true);
    }));

  });

});



