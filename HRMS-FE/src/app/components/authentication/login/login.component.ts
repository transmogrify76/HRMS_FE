import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr'; 


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

  showSpinner!: boolean;

  constructor(public hrmsService: HrmsApiService, private router: Router , private toastr: ToastrService) {}

  login() {
    console.log('Login attempted with username:', this.username, 'password:', this.password);
    this.showSpinner =true ;
    if (this.isValidLogin()) {
      this.hrmsService.login(this.username, this.password).subscribe(
        (data: any) => {
          sessionStorage.setItem('accessToken', data.token);
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(data.token);
          console.log(decodedToken);
          const empId = decodedToken.employee.empId; 
          const username = decodedToken.employee.username;
          sessionStorage.setItem('empId', empId.toString());
          sessionStorage.setItem('username', username.toString());
          this.router.navigate(['/home']);
          this.toastr.success('Login Successful', '', {
            positionClass: 'toast-bottom-center'
          });
        }
      );
      this.submitted = true;
    } else {
      console.log('Invalid login credentials');
      this.toastr.error('Login Failed', '', {
        positionClass: 'toast-bottom-center'
      }); 
      () => {
        // Hide spinner after 2 seconds
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigateByUrl('/home')
        }, 2000); // Adjust the duration as needed (2000 milliseconds = 2 seconds)
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isValidLogin(): boolean {
    // Basic validation: Check if username and password are not empty
    return (this.username.trim() !== '' && this.password.trim() !== '');
  }

  forgotPassword() {
    // Implement your forgot password logic here
    // For example, you can redirect users to a password recovery page
    // Or show a modal for password recovery options
  }
}
