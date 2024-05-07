import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPayrollsComponent } from './emp-payrolls.component';

describe('EmpPayrollsComponent', () => {
  let component: EmpPayrollsComponent;
  let fixture: ComponentFixture<EmpPayrollsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpPayrollsComponent]
    });
    fixture = TestBed.createComponent(EmpPayrollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
