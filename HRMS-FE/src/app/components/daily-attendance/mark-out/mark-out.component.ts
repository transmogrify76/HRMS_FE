import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective} from 'ngx-bootstrap/datepicker';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import {Router} from '@angular/router'
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
  submitted!: boolean;
  attendanceTime!: Time;

  constructor(private router: Router, private http:HrmsApiService) { }

  setCurrentDate() {
    this.attendanceDate = new Date();
    this.datepicker.bsValue = this.attendanceDate;
    this.timepicker.writeValue(this.attendanceDate);
  }
  setCurrentTime() {
    // Get current time
    let currentTime = new Date();
    
    // Update timepicker value
    this.timepicker.writeValue(currentTime);
  }
  

  submitAttendance() {
    this.submitted = true;


    const payload = {
      markout: this.attendanceTime
    };

    const userId: number = 1; 
    const attendanceId: number = 1; 

    this.http.markoutByUserId(userId,attendanceId, payload).subscribe(
      (data: any) => {
        console.log(payload);
        
        if (data || data.statusCode === 200) {
          this.submitted = true;
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
skip(){
  this.router.navigateByUrl('/home');
}
}
