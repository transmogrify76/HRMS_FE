import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective  } from 'ngx-bootstrap/datepicker';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';
import {Router} from '@angular/router'

@Component({
  selector: 'app-mark-in',
  templateUrl: './mark-in.component.html',
  styleUrls: ['./mark-in.component.scss']
})
export class MarkInComponent {
  @ViewChild(BsDatepickerDirective) datepicker!: BsDatepickerDirective;
  @ViewChild(TimepickerComponent) timepicker!: TimepickerComponent;

  attendanceDate!: Date;


  constructor(private router: Router) { }

  setCurrentDate() {
    this.attendanceDate = new Date();
    this.datepicker.bsValue = this.attendanceDate;
    this.timepicker.writeValue(this.attendanceDate);
  }
  setCurrentTime() {
    // Set current time
    this.attendanceDate = new Date();
    // Update timepicker value
    if (this.attendanceDate) {
      this.timepicker.writeValue(this.attendanceDate);
    }
  }

  submitAttendance() {
   
    console.log('Attendance Date & Time:', this.attendanceDate);
    this.router.navigateByUrl('/home');
  }
  skip(){
    this.router.navigateByUrl('/home');
  }
}

