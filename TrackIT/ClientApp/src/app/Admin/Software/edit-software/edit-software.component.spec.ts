import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoftwareComponent } from './edit-software.component';

describe('EditSoftwareComponent', () => {
  let component: EditSoftwareComponent;
  let fixture: ComponentFixture<EditSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
