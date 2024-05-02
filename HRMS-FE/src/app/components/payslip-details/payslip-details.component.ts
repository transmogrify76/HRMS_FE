import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'; // Import FormBuilder for creating FormGroup
import { Subscription } from 'rxjs';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-payslip-details',
  templateUrl: './payslip-details.component.html',
  styleUrls: ['./payslip-details.component.scss']
})
export class PayslipDetailsComponent {
  // Global Variables
  empId: number = 0;
  selectedEmployee: any;
  employees: any;
  selectedMonth: string = '';
  totalEarnings: number = 0;
  isReadOnly: boolean = true;
  payrollDetailsForm!: FormGroup;
  payrollData:any;

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
      Amount_Transferred: [null],
    });
  }
  fetchEmployeeData(): void {
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (data: any) => {
        this.empId = data.employee.empId;
        this.payrollData = data.employee.payrolls;
        console.log('000000000000000',   this.payrollData);

        this.payrollDetailsForm.patchValue({
          basicSalary:   this.payrollData.basicSalary,
          HRA:   this.payrollData.HRA,
          CityAllowance:   this.payrollData.CityAllowance,
          Con_Allowance:   this.payrollData.Con_Allowance,
          Other:   this.payrollData.Other,
          Total_Earnings:   this.payrollData.Total_Earnings,
          Provident_Fund:   this.payrollData.Provident_Fund !== null ?   this.payrollData.Provident_Fund : "N/A",
          Professional_Tax:   this.payrollData.Professional_Tax,
          ESI_Mediclaim:   this.payrollData.ESI_Mediclaim !== null ?   this.payrollData.ESI_Mediclaim : "N/A",
          Total_Deductions:   this.payrollData.Provident_Fund + this.payrollData.Professional_Tax + this.payrollData.ESI_Mediclaim,
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

  onWorkingDaysChange(workingDaysInputValue: any): void {
    // Parse the input value to a number
    const workingDays = parseFloat(workingDaysInputValue);
  
    // Check if workingDays is a valid number
    if (!isNaN(workingDays)) {
      // Calculate total earnings for each component based on working days
      // const formValue = this.payrollDetailsForm.value;
      const perDaybasicSalary = this.payrollData.basicSalary / 30 ;
      const perDayHRA = this.payrollData.HRA / 30 || 0;
      const perDayCityAllowance = this.payrollData.CityAllowance / 30 || 0;
      const perDayCon_Allowance = this.payrollData.Con_Allowance / 30 || 0;
      const perDayOther = this.payrollData.Other / 30 || 0;
  
      const totalEarningsBasicSalary = perDaybasicSalary * workingDays;
      const totalEarningsHRA = perDayHRA * workingDays;
      const totalEarningsCityAllowance = perDayCityAllowance * workingDays;
      const totalEarningsConAllowance = perDayCon_Allowance * workingDays;
      const totalEarningsOther = perDayOther * workingDays;
  
      // Update the form fields with calculated total earnings
      this.payrollDetailsForm.patchValue({
        basicSalary: totalEarningsBasicSalary,
        HRA: totalEarningsHRA,
        CityAllowance: totalEarningsCityAllowance,
        Con_Allowance: totalEarningsConAllowance,
        Other: totalEarningsOther,
        Total_Earnings: totalEarningsBasicSalary + totalEarningsHRA + totalEarningsCityAllowance + totalEarningsConAllowance + totalEarningsOther ,
        Provident_Fund:   this.payrollData.Provident_Fund !== null ?    (totalEarningsBasicSalary + totalEarningsHRA) * 0.24 : "N/A",
        Total_Deductions:   ((totalEarningsBasicSalary + totalEarningsHRA) * 0.24) + this.payrollData.Professional_Tax + this.payrollData.ESI_Mediclaim,
        Amount_Transferred:(totalEarningsBasicSalary + totalEarningsHRA + totalEarningsCityAllowance + totalEarningsConAllowance + totalEarningsOther) - ( ((totalEarningsBasicSalary + totalEarningsHRA) * 0.24) + this.payrollData.Professional_Tax + this.payrollData.ESI_Mediclaim)
      });
    } else {
      this.payrollDetailsForm.patchValue({
        basicSalary: null,
        HRA: null,
        CityAllowance: null,
        Con_Allowance: null,
        Other: null
      });
    }
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
