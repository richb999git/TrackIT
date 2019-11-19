import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesListSupportComponent } from './cases-list-support.component';

describe('CasesListSupportComponent', () => {
  let component: CasesListSupportComponent;
  let fixture: ComponentFixture<CasesListSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesListSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesListSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
