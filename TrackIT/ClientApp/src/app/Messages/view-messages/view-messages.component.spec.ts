import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMessagesComponent } from './view-messages.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { FormsModule } from '@angular/forms';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ShowErrorsComponent } from '../../../app/show-errors/show-errors.component';  // added
import { FromToPipe } from '../../../../src/pipes/from-to.pipe';  // added

describe('ViewMessagesComponent', () => {
  let component: ViewMessagesComponent;
  let fixture: ComponentFixture<ViewMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],  // added
      declarations: [FromToPipe, ShowErrorsComponent, ViewMessagesComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
