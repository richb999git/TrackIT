import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSoftwareComponent } from './add-software.component';

describe('AddSoftwareComponent', () => {
  let component: AddSoftwareComponent;
  let fixture: ComponentFixture<AddSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSoftwareComponent ]
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
