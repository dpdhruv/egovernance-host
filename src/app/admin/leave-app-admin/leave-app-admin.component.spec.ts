import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAppAdminComponent } from './leave-app-admin.component';

describe('LeaveAppAdminComponent', () => {
  let component: LeaveAppAdminComponent;
  let fixture: ComponentFixture<LeaveAppAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAppAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAppAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
