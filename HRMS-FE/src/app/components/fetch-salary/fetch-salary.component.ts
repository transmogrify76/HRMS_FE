import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'; // Import FormBuilder for creating FormGroup
import { Subscription } from 'rxjs';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-fetch-salary',
  templateUrl: './fetch-salary.component.html',
  styleUrls: ['./fetch-salary.component.scss'],
})
export class FetchSalaryComponent implements OnInit {
  // Global Variables
  empId: number = 0;
  selectedEmployee: any;
  employees: any;
  totalEarnings: number = 0;
  isReadOnly: boolean = true;
  payrollDetailsForm!: FormGroup;

  // Subscriptions
  private formValueChangesSubscription: Subscription | undefined;

  constructor(private hrmsService: HrmsApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.getEmployees();
    this.initForm();
  }

  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  initForm() {
    this.payrollDetailsForm = this.fb.group({
      basicSalary: [null],
      HRA: [null],
      CityAllowance: [null],
      Con_Allowance: [null],
      Other: [null],
      Total_Earnings: [null],
      Provident_Fund: [null],
      Professional_Tax: [null],
      ESI_Mediclaim: [null],
      Total_Deductions: [null],
    });
  }
  fetchEmployeeData(): void {
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (data: any) => {
        this.empId = data.employee.empId;
        console.log('000000000000000', data.employee.payrolls);
        const payrollData = data.employee.payrolls;

        this.payrollDetailsForm.patchValue({
          basicSalary: payrollData.basicSalary,
          HRA: payrollData.HRA,
          CityAllowance: payrollData.CityAllowance,
          Con_Allowance: payrollData.Con_Allowance,
          Other: payrollData.Other,
          Total_Earnings: payrollData.Total_Earnings,
          Provident_Fund: payrollData.Provident_Fund !== null ? payrollData.Provident_Fund : "N/A",
          Professional_Tax: payrollData.Professional_Tax,
          ESI_Mediclaim: payrollData.ESI_Mediclaim !== null ? payrollData.ESI_Mediclaim : "N/A",
          Total_Deductions: payrollData.Total_Deductions,
        });
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  getEmployees() {
    this.hrmsService.getEmployees().subscribe((res: any) => {
      this.employees = res.employees;
    });
  }

  toggleEditMode(): void {
    this.isReadOnly = !this.isReadOnly;
    if (!this.isReadOnly) {
        this.payrollDetailsForm.enable();
    } else {
        this.payrollDetailsForm.disable();
        this.initForm();
    }
  }

  updatePayroll() {
    const providentFundValue = this.payrollDetailsForm.value.Provident_Fund === 'N/A' ? null : this.payrollDetailsForm.value.Provident_Fund;
    const esiValue = this.payrollDetailsForm.value.ESI_Mediclaim === 'N/A' ? null : this.payrollDetailsForm.value.ESI_Mediclaim;

    const updatedPayrollData = {
        ...this.payrollDetailsForm.value,
        Provident_Fund: providentFundValue,
        ESI_Mediclaim: esiValue
    };

    this.hrmsService.updatePayroll(this.empId, updatedPayrollData).subscribe((res: any) => {
        console.log(res);
    });
  }

  calculateTotalEarnings(): void {
    const formValue = this.payrollDetailsForm.value;
    this.totalEarnings = parseInt(formValue.basicSalary || 0) +
      parseInt(formValue.HRA || 0) +
      parseInt(formValue.CityAllowance || 0) +
      parseInt(formValue.Con_Allowance || 0) +
      parseInt(formValue.Other || 0);
  
    // Unsubscribe temporarily
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  

    this.payrollDetailsForm.patchValue({
      Total_Earnings: this.totalEarnings
    });
  
    // Resubscribe after the update
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
      this.formValueChangesSubscription = this.payrollDetailsForm.valueChanges.subscribe(() => {
        this.calculateTotalEarnings();
      });
    }
  }

}
