import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAttendanceComponent } from './list-of-attendance.component';

describe('ListOfAttendanceComponent', () => {
  let component: ListOfAttendanceComponent;
  let fixture: ComponentFixture<ListOfAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfAttendanceComponent]
    });
    fixture = TestBed.createComponent(ListOfAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
