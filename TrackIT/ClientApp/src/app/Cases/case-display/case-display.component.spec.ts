import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDisplayComponent } from './case-display.component';

describe('CaseDisplayComponent', () => {
  let component: CaseDisplayComponent;
  let fixture: ComponentFixture<CaseDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDisplayComponent ]
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
