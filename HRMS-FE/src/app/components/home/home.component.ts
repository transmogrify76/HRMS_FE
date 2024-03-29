import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

  toggleOffcanvas() {
    this.showOffcanvas = !this.showOffcanvas;
  }
}
