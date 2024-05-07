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
  providentFund:number = 0;
  isReadOnly: boolean = true;
  PF:any;
  payrollDetailsForm!: FormGroup;

  // Subscriptions
  private formValueChangesSubscription: Subscription | undefined;

  constructor(private hrmsService: HrmsApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.getEmployees();
    this.initForm();


    this.formValueChangesSubscription = this.payrollDetailsForm.valueChanges.subscribe(() => {
      this.calculateTotalEarnings();
    });

    this.payrollDetailsForm.get('basicSalary')?.valueChanges.subscribe(() => {
      this.calculateProvidentFund();
    });

    this.payrollDetailsForm.get('HRA')?.valueChanges.subscribe(() => {
      this.calculateProvidentFund();
    });
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
      deduction: [null],
    });
  }
  fetchEmployeeData(): void {
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (data: any) => {
        this.empId = data.employee.empId;
        // console.log('000000000000000', data.employee.payrolls);
        const payrollData = data.employee.payrolls;
        this.payrollDetailsForm.patchValue({
          basicSalary: payrollData.basicSalary,
          HRA: payrollData.HRA,
          CityAllowance: payrollData.CityAllowance,
          Con_Allowance: payrollData.Con_Allowance,
          Other: payrollData.Other,
          Total_Earnings: payrollData.Total_Earnings,
          Provident_Fund: payrollData.Provident_Fund !== null ? payrollData.Provident_Fund : 0,
          Professional_Tax: payrollData.Professional_Tax,
          ESI_Mediclaim: payrollData.ESI_Mediclaim == null ?  0 : payrollData.ESI_Mediclaim ,
          deduction: payrollData.deduction,
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
    }
  }

  // updatePayroll() {
  //   const providentFundValue = this.payrollDetailsForm.value.Provident_Fund === 'N/A' ? null : this.payrollDetailsForm.value.Provident_Fund;
  //   const esiValue = this.payrollDetailsForm.value.ESI_Mediclaim === 'N/A' ? null : this.payrollDetailsForm.value.ESI_Mediclaim;

  //   const updatedPayrollData = {
  //       ...this.payrollDetailsForm.value,
  //       Provident_Fund:parseInt( providentFundValue),
  //       ESI_Mediclaim: esiValue
  //   };

  //   this.hrmsService.updatePayroll(this.empId, updatedPayrollData).subscribe((res: any) => {
  //       console.log(res);
  //   });
  // }

  calculateProvidentFund(): void {
    const formValue = this.payrollDetailsForm.value;
    const basicSalary = parseInt(formValue.basicSalary || 0);
    const HRA = parseInt(formValue.HRA || 0);

    const newProvidentFund = (basicSalary + HRA) * 0.24;

    this.payrollDetailsForm.patchValue({
        Provident_Fund: newProvidentFund
    });

    this.Calculate_deduction();
}

  updatePayroll() {
    const updatedPayrollData = {
        ...this.payrollDetailsForm.value
    };

    this.hrmsService.updatePayroll(this.empId, updatedPayrollData).subscribe((res: any) => {
        console.log(res);
        this.payrollDetailsForm.reset();
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

  // Calculate_deduction(): void {
  //   const formValue = this.payrollDetailsForm.value;
  //   const deduction = parseInt(formValue.Provident_Fund || 0) +
  //     parseInt(formValue.Professional_Tax || 0) + parseInt(formValue.ESI_Mediclaim || 0);
  //     console.log('deductionsssssssssssssssssssss' , deduction);
      
  //   this.payrollDetailsForm.patchValue({
  //     deduction: deduction
  //   });
  // }

  Calculate_deduction(): void {
    const formValue = this.payrollDetailsForm.value;
    const deduction = (parseInt(formValue.Provident_Fund || 0) || 0) +
                      (parseInt(formValue.Professional_Tax || 0) || 0) +
                      (parseInt(formValue.ESI_Mediclaim || 0) || 0);

    this.payrollDetailsForm.patchValue({
        deduction: deduction
    });
}
onFieldChange(): void {
  this.Calculate_deduction();
}



}
