import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; //added
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  //added
import { FormsModule } from '@angular/forms';  // added
import { AddSoftwareComponent } from './add-software.component';
import { ShowErrorsComponent } from '../../../../app/show-errors/show-errors.component';  //added

describe('AddSoftwareComponent', () => {
  let component: AddSoftwareComponent;
  let fixture: ComponentFixture<AddSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [ShowErrorsComponent, AddSoftwareComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]   // added, not sure this will work for actual mocking later though
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
