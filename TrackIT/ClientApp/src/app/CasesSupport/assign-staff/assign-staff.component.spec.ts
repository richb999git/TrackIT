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

});



