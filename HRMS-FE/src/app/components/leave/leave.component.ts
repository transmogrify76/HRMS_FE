import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  selectedMonth!: number;
  selectedYear!: number;
  startDate: string | null = null;
  endDate: string | null = null;
  reason: string = '';
  submitted: boolean = false;
  empId: any;
  minDate!: string;
  maxDate!: string;
  duration: number | undefined;
  showSpinner: boolean = false;
  email!: string;
  showCalendar: boolean = false;
  calendarDates!: string[];

  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1; 
    this.selectedYear = currentDate.getFullYear();
    this.setMinMaxDates();
  }

  setMinMaxDates() {
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1); 
    const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 0); 
    this.minDate = firstDayOfMonth.toISOString().split('T')[0]; 
    this.maxDate = lastDayOfMonth.toISOString().split('T')[0];
    console.log(this.maxDate);
    console.log(this.minDate);
  }

  submitLeaveApplication() {
    this.email = sessionStorage.getItem('email') || '';
    this.submitted = true;
    this.showSpinner = true; 

    if (!this.startDate || !this.endDate) {
      console.error('Please select start and end dates.');
      return;
    }

    const end = new Date(this.endDate.toString());
    const start = new Date(this.startDate.toString());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const duration = (Math.ceil(diffTime / (1000 * 60 * 60 * 24)))+1;
    this.duration = duration;
    this.empId=Number(sessionStorage.getItem('empId'));

    const payload = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      empId: this.empId,
      employeeEmail: this.email,
      duration:this.duration
    };

    this.hrmsApiService.leaveByUserId(payload).subscribe(
      (data: any) => {
        console.log(payload);
        if (data || data.statusCode === 200) {
          this.submitted = true;
          this.toastr.success('Leave applied successfully', 'Success', { positionClass: 'toast-top-center' });
        } else {
          console.error('Failed to submit leave application');
        }
      },
      (error: any) => {
        console.error('Error occurred while submitting leave application:', error);
        this.toastr.error('Leave application Failed',  'Error', { positionClass: 'toast-bottom-center' }); 
      },
      () => {
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigate(['/home']);
        }, 2000);
      }
    );
  }
}
