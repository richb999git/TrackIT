import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseDisplayComponent } from './case-display.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../app/show-errors/show-errors.component';  // added
import { ViewMessagesComponent } from '../../../app/Messages/view-messages/view-messages.component';  // added
import { FromToPipe } from '../../../../src/pipes/from-to.pipe';  // added
import { UploadFilesComponent } from '../../../app/FileUpload/upload-files/upload-files.component';  // added

describe('CaseDisplayComponent', () => {
  let component: CaseDisplayComponent;
  let fixture: ComponentFixture<CaseDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [UploadFilesComponent, FromToPipe, ViewMessagesComponent, ShowErrorsComponent, CaseDisplayComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
