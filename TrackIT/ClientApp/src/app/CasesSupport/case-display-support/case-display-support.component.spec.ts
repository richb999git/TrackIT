import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDisplaySupportComponent } from './case-display-support.component';

describe('CaseDisplaySupportComponent', () => {
  let component: CaseDisplaySupportComponent;
  let fixture: ComponentFixture<CaseDisplaySupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDisplaySupportComponent ]
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
});
