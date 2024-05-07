import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent implements OnInit, OnDestroy {

  // Global Variables
  selectedEmployee!: number;
  payrollDetailsForm!: FormGroup;
  showSpinner: boolean = false;
  employees: any;
  empId: number | undefined;
  totalEarnings: number = 0;
  selectedProfessionalTax: string = '';
  providentFund:number = 0;
  professionalTax: number = 0;
  isProvidentFundEnabled: boolean = false;

   // Subscriptions
  private formValueChangesSubscription: Subscription | undefined;

  constructor(
    private hrmsService: HrmsApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchEmployees();
    this.payrollDetailsForm = this.formBuilder.group({
        basicSalary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        HRA: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        CityAllowance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        Con_Allowance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        Other: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        Total_Earnings: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        Provident_Fund: [''],
        Professional_Tax: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        ESI_Mediclaim: [''],
        deduction: ['', [Validators.required, Validators.pattern]]
    });
  
    this.formValueChangesSubscription = this.payrollDetailsForm.valueChanges.subscribe(() => {
      this.calculateTotalEarnings();
    });

    this.payrollDetailsForm.get('CityAllowance')?.valueChanges.subscribe(() => {
      this.calculateProvidentFund();
    });
  }
  
  ngOnDestroy() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  toggleProvidentFund(event: any): void {
    const enabled = event.target.checked;
    this.isProvidentFundEnabled = enabled;

    // Clear the Provident Fund value if it is disabled
    if (enabled) {
      this.payrollDetailsForm.get('Provident_Fund')?.setValue(null);
        this.payrollDetailsForm.get('Provident_Fund')?.disable();
    } else {
        // Recalculate Provident Fund only if it's enabled
        this.payrollDetailsForm.get('Provident_Fund')?.enable();
        this.calculateProvidentFund();
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


  calculateProvidentFund(): void {
    const basicSalary = parseFloat(this.payrollDetailsForm.value.basicSalary) || 0;
    const HRA = parseFloat(this.payrollDetailsForm.value.HRA) || 0;
    
    const newProvidentFund = (basicSalary + HRA) * 0.24;
    console.log('=== pffffffffffff' , newProvidentFund);
    
    
    if (newProvidentFund !== this.providentFund) {
      this.providentFund = newProvidentFund;
      
      this.payrollDetailsForm.patchValue({
        Provident_Fund: parseInt(this.providentFund.toFixed(2))
      });
    }
  }

  // Calculate_deduction(): void {
  //   const formValue = this.payrollDetailsForm.value;
    
  //   // Get the selected Professional Tax value
  //   const providentFund = parseInt(formValue.Provident_Fund);
  //   const professionalTaxValue = parseInt(this.selectedProfessionalTax);
  //   console.log('typeeeeeof' , typeof(professionalTaxValue));
    
  //   const esiMediclaim = parseInt(formValue.ESI_Mediclaim);


  //   // Calculate total deductions
  //   const deduction = providentFund +
  //                     professionalTaxValue +
  //                     esiMediclaim;
  //                     console.log('deductionssssssssssssssssss' , deduction , '------====' , professionalTaxValue);
                      
  //   // Update deduction in the form
  //   this.payrollDetailsForm.patchValue({
  //     deduction: deduction
  //   });
  // }

  Calculate_deduction(): void {
    const formValue = this.payrollDetailsForm.value;
  
    // Get the selected Professional Tax value
    const providentFund = formValue.Provident_Fund ? parseInt(formValue.Provident_Fund) : 0;
    const professionalTaxValue = parseInt(this.selectedProfessionalTax);
    const esiMediclaim = formValue.ESI_Mediclaim ? parseInt(formValue.ESI_Mediclaim) : 0;
  
    // Calculate total deductions
    const deduction = providentFund + professionalTaxValue + esiMediclaim;
    console.log('deductionssssssssssssssssss' , deduction , '------====' , professionalTaxValue);
  
    // Update deduction in the form
    this.payrollDetailsForm.patchValue({
      deduction: deduction
    });
  }
  

  fetchEmployees(): void {
    this.hrmsService.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (employee: any) => {
        this.empId = employee?.employee?.empId;
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  addPayrollDetails(): void {
    const payload: any = {
      basicSalary: this.payrollDetailsForm.value.basicSalary,
      HRA: this.payrollDetailsForm.value.HRA,
      CityAllowance: this.payrollDetailsForm.value.CityAllowance,
      Con_Allowance: this.payrollDetailsForm.value.Con_Allowance,
      Other: this.payrollDetailsForm.value.Other,
      Total_Earnings: this.payrollDetailsForm.value.Total_Earnings,
      Provident_Fund: this.payrollDetailsForm.value.Provident_Fund,
      Professional_Tax: parseInt(this.payrollDetailsForm.value.Professional_Tax),
      ESI_Mediclaim: parseInt(this.payrollDetailsForm.value.ESI_Mediclaim),
      deduction: parseInt(this.payrollDetailsForm.value.deduction),
      employee: this.empId
    };

    this.showSpinner = true;
    this.hrmsService.payrollDetails(payload).subscribe(
      (response: any) => {
        this.payrollDetailsForm.reset();
        this.showSpinner = false;
      },
      (error: any) => {
        console.error('Error adding payroll details:', error);
        this.showSpinner = false;
      }
    );
  }
}
