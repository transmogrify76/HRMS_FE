import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  currentDate: Date = new Date();
  calendar: Date[][] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Define weekday names here

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  
    let startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
  
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
    this.calendar = [];
  
    while (startDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
      this.calendar.push(week);
    }
  
    console.log('Generated Calendar:', this.calendar); // Add this line to log the generated calendar
  }
  

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    console.log('Previous Month:', this.currentDate);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  isAbsent(day: Date): boolean {
    // Logic to determine if the day is marked as absent
    // For demonstration purposes, let's mark every 3rd day as absent
    return day.getDate() % 3 === 0;
  }

  isLeave(day: Date): boolean {
    // Logic to determine if the day is marked as leave application
    // For demonstration purposes, let's mark every 5th day as leave
    return day.getDate() % 5 === 0;
  }

  selectDate(selectedDate: Date): void {
    // Logic to handle when a date is selected
    console.log('Selected Date:', selectedDate);
  }
}
