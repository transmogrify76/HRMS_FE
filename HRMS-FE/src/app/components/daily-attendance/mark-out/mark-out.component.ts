import { Component, ViewChild } from '@angular/core';
import { BsDatepickerDirective, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerComponent, TimepickerModule } from 'ngx-bootstrap/timepicker';
import {Router} from '@angular/router'

@Component({
  selector: 'app-mark-out',
  templateUrl: './mark-out.component.html',
  styleUrls: ['./mark-out.component.scss']
})
export class MarkOutComponent {
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
    // Get current time
    let currentTime = new Date();
    
    // Update timepicker value
    this.timepicker.writeValue(currentTime);
  }
  

  submitAttendance() {
   
    console.log('Attendance Date & Time:', this.attendanceDate);
    this.router.navigateByUrl('/home');
  }
  skip(){
    this.router.navigateByUrl('/home');
  }
}

