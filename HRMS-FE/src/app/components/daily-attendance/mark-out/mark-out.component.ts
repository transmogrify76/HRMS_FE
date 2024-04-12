import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { Router } from '@angular/router';
import { Time } from 'ngx-bootstrap/timepicker/timepicker.models';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-mark-out',
  templateUrl: './mark-out.component.html',
  styleUrls: ['./mark-out.component.scss']
})
export class MarkOutComponent {
  @ViewChild(BsDatepickerDirective) datepicker!: BsDatepickerDirective;
  @ViewChild(TimepickerComponent) timepicker!: TimepickerComponent;

  attendanceDate!: Date;
  userId:number=0;
  attendanceId:number= 0 ;
  submitted!: boolean;
  attendanceTime!: Time;
  showSpinner!: boolean;
  checkIn!: string;

  constructor(private router: Router, private http: HrmsApiService ,private toastr: ToastrService) { }

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('UserId'));
    // this.attendanceId = Number(sessionStorage.getItem('AttendanceId'));
    this.attendanceId = Number(localStorage.getItem('AttendanceId'));
    console.log( ' 43433434===========' , this.attendanceId);
    

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
    const payload = {
      checkOut: this.checkIn
    };

    this.http.markoutByUserId(this.attendanceId , payload).subscribe(
      (data: any) => {
        console.log(payload);
        sessionStorage.getItem('AttendanceId');
        

        if (data || data.statusCode === 200) {
          this.submitted = true;
          this.router.navigate(['/home']);
          this.toastr.success('Markout successful', '', {
            positionClass: 'toast-bottom-center'
          }); 
        } else {
          console.error('Failed to give attendance');
          this.toastr.error('Markout Failed', '', {
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
        }, 2000);
      }
    );
    
  }

  skip() {
    this.router.navigateByUrl('/home');
  }
}
