import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkillsComponent } from './view-skills.component';

describe('ViewSkillsComponent', () => {
  let component: ViewSkillsComponent;
  let fixture: ComponentFixture<ViewSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSkillsComponent ]
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
