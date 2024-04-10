import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {
  startDate: String | null = null;
  endDate: string | null = null;
  reason: string = '';
  submitted: boolean = false;
  empId: any;
  showSpinner!: boolean;
  
  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router
  ) {}
  

  submitLeaveApplication() {
    this.submitted = true;
    this.showSpinner = true; 
    if (!this.startDate || !this.endDate) {
      console.error('Please select start and end dates.');
      return;
    }
    this.empId=Number(sessionStorage.getItem('empId'));
    console.log('==========', this.empId);
    

    const payload = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      employee:this.empId
    };

    

    this.hrmsApiService.leaveByUserId(payload).subscribe(
      (data: any) => {
        console.log(payload);
        
        if (data || data.statusCode === 200) {
          this.submitted = true;
          this.router.navigate(['/home']);
        } else {
          console.error('Failed to submit leave application');
        }
      },
      (error: any) => {
        console.error('Error occurred while submitting leave application:', error);
      },
      () => {
        // Hide spinner after 2 seconds
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigateByUrl('/home')
        }, 2000);
      }
    );
  }
}
