import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // added
import { RouterTestingModule } from '@angular/router/testing';  // added
import { ViewSkillsComponent } from './view-skills.component';
import { ShowErrorsComponent } from '../../../../app/show-errors/show-errors.component';
import { ModalModule } from 'ngx-bootstrap/modal';

describe('ViewSkillsComponent', () => {
  let component: ViewSkillsComponent;
  let fixture: ComponentFixture<ViewSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ModalModule.forRoot()],  // added
      declarations: [ShowErrorsComponent, ViewSkillsComponent],
      providers: [
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
