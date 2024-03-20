import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email!: string;

  constructor() { }

  ngOnInit(): void {
  }

  resetPassword() {
    // Here you can implement the logic to handle resetting the password
    // For example, you can send a reset password link to the provided email address
    console.log('Resetting password for email:', this.email);
    // You can call a service here to initiate password reset process
  }
}
