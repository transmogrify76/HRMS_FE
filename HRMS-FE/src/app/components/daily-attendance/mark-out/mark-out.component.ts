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
    this.attendanceId = Number(localStorage.getItem('AttendanceId'));
    console.log('Attendance ID:', this.attendanceId);
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
    const markedInToday = localStorage.getItem('markedInToday');

    if (markedInToday === 'true') {
      // Proceed with mark-out process
      this.submitted = true;
      this.showSpinner = true; 
    
      const payload = {
        checkOut: this.checkIn
      };

      this.http.markoutByUserId(this.attendanceId, payload).subscribe(
        (data: any) => {
          if (data || data.statusCode === 200) {
            localStorage.setItem('markedInToday', 'false'); 
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
          this.showSpinner = false;
        console.error('Error occurred while giving attendance:', error);
          this.toastr.error('Invalid input', '', {
          positionClass: 'toast-bottom-center'
        });
      },
        () => {
          // Hide spinner after 2 seconds
          setTimeout(() => {
            this.showSpinner = false;
            this.router.navigateByUrl('/home')
          }, 2000);
        }
      );
    } else {
      this.toastr.error('Markin First', '', {
        positionClass: 'toast-bottom-center'})
      console.log('Cannot mark out. Not marked in today.');
      
    }
  }

  skip() {
    this.router.navigateByUrl('/home');
  }
}
