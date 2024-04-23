import { Component } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';

function adhaarCardValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^\d{16}$/.test(control.value);
    return isValid ? null : { 'invalidAdhaarCard': { value: control.value } };
  };
}
function accountNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^\d+$/.test(control.value); // This regex ensures that the value contains only digits
    return isValid ? null : { 'invalidAccountNumber': { value: control.value } };
  };
}
@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.scss']
})
export class EmpDetailsComponent {

  empDetailsForm: FormGroup; // Define FormGroup

  // Define other variables
  employees: any;
  selectedEmployee!: number;
  submitted: boolean = false;
  showSpinner: boolean = false;
  employeeDetails: any = null;
  empId: number | null = null;

  constructor(
    private formBuilder: FormBuilder, // Inject FormBuilder
    private toastr: ToastrService,
    private hrmsService: HrmsApiService,
    public router: Router,
  ) {
    // Initialize the form in the constructor
    this.empDetailsForm = this.formBuilder.group({
      adhaarCardNo: ['', [Validators.required, adhaarCardValidator()]], // Apply the custom validator
      bankAccountNo: ['', [Validators.required, accountNumberValidator()]], 
      IFSCno: ['', [Validators.required, Validators.pattern('[A-Za-z]{4}[0-9]{7}')]], // Example IFSC pattern, adjust as needed
      panNo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
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
        this.employeeDetails = employee;
        this.empId = this.employeeDetails.employee.empId;
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  // Function to submit employee details
  empdetails() {
    console.log('=====================================================================' , this.empId);
    
    this.submitted = true;
    // if (this.empDetailsForm.invalid) {
    //   this.toastr.error('Please fill all the required fields correctly.', 'Invalid Input', { positionClass: 'toast-top-center' }); 
    //   return;
    // }

    this.showSpinner = true;
    const payload = {
      bankAccountNo: this.empDetailsForm.value.bankAccountNo,
      IFSCno: this.empDetailsForm.value.IFSCno,
      employee: this.empId,
    };

    this.hrmsService.empdetails(payload).subscribe(
      (data: any) => {
        if (data || data.statusCode === 200) {
          this.toastr.success('Details uploaded', 'Success', { positionClass: 'toast-top-center' });
        } else {
          console.error('Upload failed');
        }
      },
      (error: any) => {
        console.error('Error occurred while uploading details:', error);
        this.toastr.error('Upload failed',  'Error', { positionClass: 'toast-top-center' }); 
      },
      () => {
        // Hide spinner after 2 seconds and navigate to home
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigate(['/home']);
        }, 2000);
      }
    );
  }
}
