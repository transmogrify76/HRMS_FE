import { Component } from '@angular/core';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {
  startDate!: string;
  endDate!: string;
  reason!: string;

  submitLeaveApplication() {
    // Logic to submit leave application
    console.log('Leave application submitted.');
    // You can further implement HTTP requests to send this data to your server
  }
}
