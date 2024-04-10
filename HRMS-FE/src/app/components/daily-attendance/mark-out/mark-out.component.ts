import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { Router } from '@angular/router';
import { Time } from 'ngx-bootstrap/timepicker/timepicker.models';

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

  constructor(private router: Router, private http: HrmsApiService) { }

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('UserId'));
    this.attendanceId = Number(sessionStorage.getItem('AttendanceId'));
    console.log( ' 43433434===========' , this.attendanceId);
    

  }

  setCurrentDate() {
    this.attendanceDate = new Date();
    this.datepicker.bsValue = this.attendanceDate;
    this.timepicker.writeValue(this.attendanceDate);
  }

  setCurrentTime() {
    // Get current time
    const currentTime = new Date();

    // Format time to HH:MM
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedHours = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const currentTimeString = formattedHours + ':' + formattedMinutes;

    // Update timepicker value
    this.attendanceTime = currentTimeString as unknown as Time; // Convert string to Time type
    this.timepicker.writeValue(currentTimeString);
  }
  
  submitAttendance() {

    this.submitted = true;

    const payload = {
      checkOut: this.attendanceTime
    };

    this.http.markoutByUserId(this.attendanceId , payload).subscribe(
      (data: any) => {
        console.log(payload);
        sessionStorage.getItem('AttendanceId');
        

        if (data || data.statusCode === 200) {
          this.submitted = true;
          // this.router.navigate(['/home']);
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
