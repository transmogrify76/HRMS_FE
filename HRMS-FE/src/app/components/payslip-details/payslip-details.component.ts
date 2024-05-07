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

  private formValueChangesSubscription: Subscription | undefined;
  workingDays1: any;

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
      workingDays: [null],
      basicSalary: [null],
      HRA: [null],
      CityAllowance: [null],
      Con_Allowance: [null],
      Other: [null],
      Total_Earnings: [null],
      Provident_Fund: [null],
      Professional_Tax: [null],
      ESI_Mediclaim: [null],
      totaldeduction: [null],
      transferred_amount: [null],
      otherdeduction: [null],
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
          otherdeduction:   this.payrollData.otherdeduction ? this.payrollData.otherdeduction : 0,
          Provident_Fund:   this.payrollData.Provident_Fund !== null ?   this.payrollData.Provident_Fund : "N/A",
          Professional_Tax:   this.payrollData.Professional_Tax,
          ESI_Mediclaim:   this.payrollData.ESI_Mediclaim !== null ?   this.payrollData.ESI_Mediclaim : "N/A",
          totaldeduction:   this.payrollData.deduction,
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
    const workingDays = parseInt(workingDaysInputValue);
    this.workingDays1 = parseInt(workingDaysInputValue);
  
    // Check if workingDays is a valid number
    if (!isNaN(workingDays)) {

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
        basicSalary: totalEarningsBasicSalary.toFixed(2),
        HRA: totalEarningsHRA.toFixed(2),
        CityAllowance: totalEarningsCityAllowance.toFixed(2),
        Con_Allowance: totalEarningsConAllowance.toFixed(2),
        Other: totalEarningsOther.toFixed(2),
        Total_Earnings: (totalEarningsBasicSalary + totalEarningsHRA + totalEarningsCityAllowance + totalEarningsConAllowance + totalEarningsOther).toFixed(2) ,
        Provident_Fund: this.payrollData.Provident_Fund !== null ?    (totalEarningsBasicSalary + totalEarningsHRA) * 0.24 : "N/A",
        otherdeduction: this.payrollData.otherdeduction ? this.payrollData.otherdeduction : 0 ,
        totaldeduction:(((totalEarningsBasicSalary + totalEarningsHRA) * 0.24) + this.payrollData.Professional_Tax + this.payrollData.ESI_Mediclaim).toFixed(2),
        transferred_amount:((totalEarningsBasicSalary + totalEarningsHRA + totalEarningsCityAllowance + totalEarningsConAllowance + totalEarningsOther) - ( ((totalEarningsBasicSalary + totalEarningsHRA) * 0.24) + this.payrollData.Professional_Tax + this.payrollData.ESI_Mediclaim)).toFixed(2),
      });
      console.log('formvalueeeeeeeeeeeeee',this.payrollDetailsForm.value);
      
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

  calculateTotalDeductionOnOthers(otherDeductionValue: any): void {
    const formValue = this.payrollDetailsForm.value;
    const totalDeduction = parseInt(formValue.Provident_Fund || 0) + parseInt(formValue.Professional_Tax || 0) + parseInt(formValue.ESI_Mediclaim || 0) + parseInt(otherDeductionValue) ;
    console.log('==========' , otherDeductionValue , totalDeduction);
    this.payrollDetailsForm.patchValue({
      totaldeduction: totalDeduction
    });

    const totalEarnings = parseInt(formValue.Total_Earnings || 0);
    const transferredAmount = totalEarnings - totalDeduction;

    this.payrollDetailsForm.patchValue({
      transferred_amount: transferredAmount.toFixed(2)
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
  submit(){
    const payload = {
      basicSalary: parseInt(this.payrollDetailsForm.value.basicSalary),
      HRA: parseInt(this.payrollDetailsForm.value.HRA),
      CityAllowance: parseInt(this.payrollDetailsForm.value.CityAllowance),
      Con_Allowance: parseInt(this.payrollDetailsForm.value.Con_Allowance),
      Other: parseInt(this.payrollDetailsForm.value.Other),
      Total_Earnings: parseInt((this.payrollDetailsForm.value.Total_Earnings)),
      workingDays: this.workingDays1,
      Provident_Fund: parseInt(this.payrollDetailsForm.value.Provident_Fund),
      Professional_Tax: parseInt(this.payrollDetailsForm.value.Professional_Tax),
      otherdeduction: this.payrollDetailsForm.value.otherdeduction ? this.payrollDetailsForm.value.otherdeduction : 0 ,
      ESI_Mediclaim: parseInt(this.payrollDetailsForm.value.ESI_Mediclaim),
      totaldeduction:parseInt(this.payrollDetailsForm.value.totaldeduction),
      transferred_amount: parseInt(this.payrollDetailsForm.value.transferred_amount),
      employee: this.empId,
      month:this.selectedMonth
    };
    console.log(payload)
    this.hrmsService.Payrolldetails(payload).subscribe(
      (data: any) => {   
      },
      (error: any) => {
        console.error('Error occurred while uploading details:', error);
        },

    );
  }

}
