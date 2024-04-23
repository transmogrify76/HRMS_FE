import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { RegistrationData } from './registration.model';
import { ToastrService } from 'ngx-toastr';

function adhaarCardValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = /^\d{16}$/.test(control.value);
    return isValid ? null : { 'invalidAdhaarCard': { value: control.value } };
  };
}

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent {
  signUpForm!: FormGroup;
  showSpinner!: boolean;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private hrmsService: HrmsApiService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      aadhaarNo: ['', [Validators.required, adhaarCardValidator()]],
      panNo: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      // bankAccountNo: ['', this.validateAccountNumber],
      // IFSCno: ['', this.validateIFSC],
    });
  }

  // validateAccountNumber(control: AbstractControl) {
  //   const accountNumberPattern = /^[0-9]+$/;
  //   if (control.value && !accountNumberPattern.test(control.value)) {
  //     return { invalidAccountNumber: true };
  //   }
  //   return null;
  // }

  // validateIFSC(control: AbstractControl) {
  //   const ifscPattern = /^[A-Za-z]{4}[0-9]{7}$/;
  //   if (control.value && !ifscPattern.test(control.value)) {
  //     return { invalidIFSC: true };
  //   }
  //   return null;
  // }

  registerData() {
    this.submitted = true;
    this.showSpinner = true;

    if (this.signUpForm.valid) {
      const userData: RegistrationData = this.signUpForm.value;
      console.log('Registering user:', userData);

      this.hrmsService.register(userData).subscribe(
        response => {
          console.log('Registration response:', response);
          this.toastr.success('Registered successfully', 'Success', { positionClass: 'toast-top-center' });

          // Hide spinner after 2 seconds and route to home page
          setTimeout(() => {
            this.showSpinner = false;
            this.router.navigate(['/home']);
          }, 2000);
        },
        error => {
          console.error('Error occurred during registration:', error);
          this.toastr.error('Registration Failed', 'Error', { positionClass: 'toast-top-center' });
          this.showSpinner = false; // Hide spinner if registration fails
        }
      );
    } else {
      this.toastr.error('Please fill in all required fields', 'Error', { positionClass: 'toast-top-center' });
      this.showSpinner = false; // Hide spinner if form is invalid
    }
  }
}
