import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  submitted: boolean = false;

  constructor(public hrmsService : HrmsApiService , private router: Router) { }

  
  login() {
    console.log('Login attempted with username:', this.username, 'password:', this.password);
    this.hrmsService.login(this.username, this.password).subscribe(
      (data : any) => {
        sessionStorage.setItem('accessToken', data.token);
        this.router.navigate(['/home']);
      }
    );
    this.submitted = true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isValidLogin(): boolean {
    // Implement your login validation logic here
    // This function should check if the username and password are valid based on your authentication logic.
    // You can return true if the credentials are valid, otherwise false.
    return (this.username !== '' && this.password !== ''); // Basic validation example (replace with your logic)
  }
  forgotPassword() {
    // Implement your forgot password logic here
    // For example, you can redirect users to a password recovery page
    // Or show a modal for password recovery options
  }
}
