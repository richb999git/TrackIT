import { async, ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { CaseDisplaySupportComponent } from './case-display-support.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../app/show-errors/show-errors.component';  // added
import { ViewMessagesComponent } from '../../../app/Messages/view-messages/view-messages.component';  // added
import { FromToPipe } from '../../../../src/pipes/from-to.pipe';  // added
import { UploadFilesComponent } from '../../../app/FileUpload/upload-files/upload-files.component';  // added
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AssignStaffComponent } from '../assign-staff/assign-staff.component';
import { PaginationComponent } from '../../../app/pagination/pagination.component';  // added
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('CaseDisplaySupportComponent', () => {
  let component: CaseDisplaySupportComponent;
  let fixture: ComponentFixture<CaseDisplaySupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, BsDatepickerModule.forRoot()],  // added
      declarations: [PaginationComponent, AssignStaffComponent, UploadFilesComponent, FromToPipe, ViewMessagesComponent, ShowErrorsComponent, CaseDisplaySupportComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDisplaySupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show title as Manager View when user is a manager', async(() => {

    // ARRANGE
    var mockRoles = ["employee", "admin", "manager"];

    // https://medium.com/@paynoattn/simple-observable-unit-testing-in-angular2-43c4f4a0bfe2 (earlier version of Angular)
    function getUserRole(): Observable<string[]> {
      return of(mockRoles);
    }

    // ACT
    component['userRole'] = getUserRole();

    //ASSERT
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const title = fixture.nativeElement.children[0].textContent;
      expect(title).toContain('Manager View');
    });   
  }));

  it('should show title as Developer View when user is a NOT manager', fakeAsync(() => {

    // ARRANGE
    var mockRoles = ["employee"];

    function getUserRole(): Observable<string[]> {
      return of(mockRoles);
    }

    // ACT
    component['userRole'] = getUserRole();

    //ASSERT
    tick(1);
    fixture.detectChanges();
    const title = fixture.nativeElement.children[0].textContent;
    expect(title).toContain('Developer View');
    
  }));

});
