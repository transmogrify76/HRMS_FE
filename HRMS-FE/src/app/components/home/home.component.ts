import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor( private router: Router) { }
  showOffcanvas: boolean = false;
  notificationCount: number = 3; // Example notification count
  holidays: any[] = [  // Example holiday data
    { occasion: 'New Year', date: '01-01-2024', day: 'Wednesday' },
    { occasion: 'Republic Day', date: '26-01-2024', day: 'Friday' },
    { occasion: 'Doljatra', date: '25-03-2024', day: 'Monday' },
    { occasion: 'May Day', date: '01-05-2024', day: 'Wednesday' },
    { occasion: 'Independence Day', date: '15-08-2024', day: 'Thursday' },
    { occasion: 'Gandhiji Birth Day', date: '02-10-2024', day: 'Wednesday' },
    { occasion: 'Durgapuga-Saptami', date: '10-10-2024', day: 'Thursday' },
    { occasion: 'Durgapuga-Astomi', date: '11-10-2024', day: 'Friday' },
    { occasion: 'Durgapuga-Navami', date: '12-10-2024', day: 'Saturday' },
    { occasion: 'Laksmi Puja', date: '16-10-2024', day: 'Wednesday' },
    { occasion: 'Kali Puja', date: '31-10-2024', day: 'Thursday' },
    { occasion: 'Christmas Day', date: '25-12-2024', day: 'Wednesday' },
    // Add more holidays as needed
  ];
  currentDate: Date = new Date();
  calendar: Date[][] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Define weekday names here

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
    // Decrease the month by 1
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate());
  
    // Regenerate the calendar with the updated date
    this.generateCalendar();
  }
  
  nextMonth(): void {
    // Increase the month by 1
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
  
    // Regenerate the calendar with the updated date
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

  toggleOffcanvas() {
    this.showOffcanvas = !this.showOffcanvas;
  }
  markin(){
    this.router.navigate(['/mark-in']);
  }
  markout(){
    this.router.navigate(['/mark-out']);
  }
}
