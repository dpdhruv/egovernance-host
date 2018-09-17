import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLeaveAppComponent } from './student-leave-app.component';

describe('StudentLeaveAppComponent', () => {
  let component: StudentLeaveAppComponent;
  let fixture: ComponentFixture<StudentLeaveAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLeaveAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLeaveAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
