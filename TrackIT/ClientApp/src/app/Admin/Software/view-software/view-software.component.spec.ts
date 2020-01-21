import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; //added
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { ViewSoftwareComponent } from './view-software.component';
import { ShowErrorsComponent } from '../../../../app/show-errors/show-errors.component';  //added
import { ModalModule } from 'ngx-bootstrap/modal';

describe('ViewSoftwareComponent', () => {
  let component: ViewSoftwareComponent;
  let fixture: ComponentFixture<ViewSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ModalModule.forRoot()],  // added
      declarations: [ShowErrorsComponent, ViewSoftwareComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]   // added, not sure this will work for actual mocking later though
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
