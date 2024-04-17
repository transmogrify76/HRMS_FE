import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { RegistrationData } from './registration.model';
import { ToastrService } from 'ngx-toastr';

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
    public router:Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      joiningDate:['', [Validators.required]],
    });
  }

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