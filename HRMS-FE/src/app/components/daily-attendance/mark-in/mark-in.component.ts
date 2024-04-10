import { Component, ViewChild } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { Router } from '@angular/router';
import { Time } from '@angular/common';

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


  constructor(private router: Router, private http: HrmsApiService) { 
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
    this.empId=Number(sessionStorage.getItem('empId'));
    console.log('==========', this.empId);
    const payload = {
      checkIn: this.checkIn,
      employee:this.empId
    };

    

    this.http.markinByUserId(payload).subscribe(
      (data: any) => {
        if (data || data.statusCode === 200) {
          this.submitted = true;
          sessionStorage.setItem('AttendanceId', data.attId);
          sessionStorage.setItem('UserId', data.user.id);   
          this.router.navigate(['/home']);
        } else {
          console.error('Failed to give attendance');
        }
      },
      (error: any) => {
        console.error('Error occurred while giving attendance:', error);
      }
    );

  }

  skip() {
    this.router.navigateByUrl('/home');
  }
}
