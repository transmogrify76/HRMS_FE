import { Component, ViewChild } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { Router } from '@angular/router';
import { Time } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-mark-in',
  templateUrl: './mark-in.component.html',
  styleUrls: ['./mark-in.component.scss']
})
export class MarkInComponent {


  checkIn!: any;
  submitted!: boolean;
  attendanceTime!: Time;
  empId: any;
  showSpinner!: boolean;


  constructor(private router: Router, private http: HrmsApiService,private toastr: ToastrService) { 
  }
  setCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    this.checkIn = new Date().toLocaleString('en-US', options);
}

  

submitAttendance() {
  this.submitted = true;
  this.showSpinner = true; 
  this.empId = Number(sessionStorage.getItem('empId'));
  console.log('==========', this.empId);

  const payload = {
    checkIn: this.checkIn,
    employee: this.empId
  };

  this.http.markinByUserId(payload).subscribe(
    (data: any) => {
      if (data || data.statusCode === 200) {
        this.submitted = true;
        // sessionStorage.setItem('AttendanceId', data.attId);
        localStorage.setItem('AttendanceId', data.attId);
        // Navigate to the home page
        this.router.navigate(['/home']);
        this.toastr.success('Markin Successful', '', {
          positionClass: 'toast-bottom-center'
        });
      } else {
        console.error('Failed to give attendance');
        this.toastr.error('Markin Failed', '', {
          positionClass: 'toast-bottom-center'
        }); 
      }
    },
    (error: any) => {
      console.error('Error occurred while giving attendance:', error);
    },
    () => {
      // Hide spinner after 2 seconds
      setTimeout(() => {
        this.showSpinner = false;
        this.router.navigateByUrl('/home')
      }, 2000); // Adjust the duration as needed (2000 milliseconds = 2 seconds)
    }
    
  );
}

  skip() {
    this.router.navigateByUrl('/home');
  }
}
