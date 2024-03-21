import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerComponent, TimepickerModule } from 'ngx-bootstrap/timepicker';


@Component({
  selector: 'app-mark-in',
  templateUrl: './mark-in.component.html',
  styleUrls: ['./mark-in.component.scss']
})
export class MarkInComponent {
  @ViewChild(BsDatepickerDirective) datepicker!: BsDatepickerDirective;
  @ViewChild(TimepickerComponent) timepicker!: TimepickerComponent;

  attendanceDate!: Date;


  constructor() { }

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
    // Handle form submission here
    console.log('Attendance Date & Time:', this.attendanceDate);
    // You can send this data to your backend or perform any other actions
  }
}

