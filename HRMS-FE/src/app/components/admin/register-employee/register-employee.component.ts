import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { RegistrationData } from './registration.model';


@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent {
  signUpForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private hrmsService: HrmsApiService,
    public router:Router
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
    console.log(this.signUpForm.valid);
    
    if (this.signUpForm.valid) {
      const userData: RegistrationData = this.signUpForm.value;
      console.log('Registering user:', userData);

      this.hrmsService.register(userData).subscribe(response =>{
        console.log('Registration response:', response);
      });
    } else {
      console.error('Invalid form data. Please check the form.',console.error()
      );
    }
  }
}

