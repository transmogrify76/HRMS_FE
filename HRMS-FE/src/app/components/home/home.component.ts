import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor( private router: Router,private hrmsApiService: HrmsApiService,) { }
  showOffcanvas: boolean = false;
  private hasRunOnce: boolean = true;
  notificationCount: number = 3; // Example notification count
  holidays: any[] = [  // Example holiday data
    { occasion: 'New Year', date: '01-01-2025', day: 'Wednesday' },
    { occasion: 'Netaji Birthday', date: '23-01-2025', day: 'Thursday' },
    { occasion: 'Doljatra', date: '14-03-2025', day: 'Friday' },
    { occasion: 'May Day', date: '01-05-2025', day: 'Thursday' },
    { occasion: 'Independence Day', date: '15-08-2025', day: 'Friday' },
    { occasion: 'Durgapuga-Saptami', date: '29-09-2025', day: 'Monday' },
    { occasion: 'Durgapuga-Astomi', date: '30-09-2025', day: 'Tuesday' },
    { occasion: 'Durgapuga-Navami', date: '01-10-2025', day: 'Wednesday' },
    { occasion: 'Gandhiji Birth Day', date: '02-10-2024', day: 'Thursday' },
    { occasion: 'Laksmi Puja', date: '06-10-2025', day: 'Monday' },
    { occasion: 'Kali Puja', date: '20-10-2025', day: 'Monday' },
    { occasion: 'Christmas Day', date: '25-12-2025', day: 'Thursday' },
  ];
  currentDate: Date = new Date();
  calendar: Date[][] = [];
  roleType: any;
  empId: any;
  pendingLeaves: any[] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 
  ngOnInit(): void {
    this.generateCalendar();
    this.leaverequest();
    this.roleType = sessionStorage.getItem('roleType');
  }


  leaverequest(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.employeebyId(this.empId).subscribe(
      (data: any) => {
        console.log(data);
        this.pendingLeaves = data.employee.leaves.filter((leave: { leaveStatus: string; }) => leave.leaveStatus === 'PENDING');
        console.log(this.pendingLeaves);        
        // Store roleType in session storage
        const roleType = data.employee.role.roleType;
        sessionStorage.setItem('roleType', roleType);
  
        // Disable "List of leaves" button if roleType is not ADMIN
        if (roleType !== 'ADMIN') {
          this.disableListOfLeavesButton();
        }
      }
    );
  }
  isAdmin(): boolean {
    const roleType = sessionStorage.getItem('roleType');
    return roleType === 'ADMIN';
  }
  isEMP(): boolean {
    const roleType = sessionStorage.getItem('roleType');
    return roleType === 'EMPLOYEE';
  }

  
  disableListOfLeavesButton(): void {
    const listofleavesButton = document.getElementById('listofleaves') as HTMLButtonElement;
    if (listofleavesButton) {
      listofleavesButton.disabled = true;
    }
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

    console.log(); // Add this line to log the generated calendar
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
    return day.getDate() % 3 === 0;
  }

  isLeave(day: Date): boolean {
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
  listofleaves(){
    this.router.navigate(['/empdetails']);
  }
  listoftotalleaves(){
    this.router.navigate(['/total-leaves']);
  }
  listofattendance(){
    this.router.navigate(['/list-of-attendance']);
  }
  listofemployees(){
    this.router.navigate(['/list-of-employees'])
  }
  personalleave(){
    this.router.navigate(['/personalleave'])
  }
  register(){
    this.router.navigate(['/register-employee'])
  }
  empdetailsupload(){
    this.router.navigate(['/emp-details-upload'])
  }
  
}
