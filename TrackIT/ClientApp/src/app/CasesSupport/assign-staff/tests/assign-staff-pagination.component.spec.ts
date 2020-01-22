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


  describe('Pagination tests', () => {


    it('should set correct pagination arrays for before and after selected page - 2nd page of 4', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 2, totalPages: 4, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([1]);
      expect(component['pagesAfter']).toEqual([3, 4]);
    });

    it('should set correct pagination arrays for before and after selected page - 1st page of 4', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 1, totalPages: 4, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([]);
      expect(component['pagesAfter']).toEqual([2, 3, 4]);

    });

    it('should set correct pagination arrays for before and after selected page - 4th page of 4', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 4, totalPages: 4, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([1, 2, 3]);
      expect(component['pagesAfter']).toEqual([]);

    });

    it('should set correct pagination arrays for before and after selected page - 1 page', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 1, totalPages: 1, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([]);
      expect(component['pagesAfter']).toEqual([]);

    });

    it('should set correct pagination arrays for before and after selected page - 2nd page of 15', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 2, totalPages: 15, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([1]);
      expect(component['pagesAfter']).toEqual([3, 4, 5, 6]);

    });

    it('should set correct pagination arrays for before and after selected page - 6th page of 15', () => {
      // ARRANGE
      component['maxPagesEitherSide'] = 4;

      component['usersP'] = {
        pageIndex: 6, totalPages: 15, pageSize: 4, users: {
          contactId: null, firstName: "John", lastName: "Doe", email: null, userName: null,
          isManager: null, id: "a1", find: null
        }
      };

      // ACT
      component.setPagination();

      // ASSERT
      expect(component['pagesBefore']).toEqual([2, 3, 4, 5]);
      expect(component['pagesAfter']).toEqual([7, 8, 9, 10]);

    });

  });

});



