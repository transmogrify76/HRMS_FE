import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesForEmployeeComponent } from './leaves-for-employee.component';

describe('LeavesForEmployeeComponent', () => {
  let component: LeavesForEmployeeComponent;
  let fixture: ComponentFixture<LeavesForEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesForEmployeeComponent]
    });
    fixture = TestBed.createComponent(LeavesForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
