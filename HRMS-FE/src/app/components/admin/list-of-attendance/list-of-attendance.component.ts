import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { jsPDF } from 'jspdf';

export interface AttendanceDetails {
  checkIn: string;
  checkOut: string;
}

@Component({
  selector: 'app-list-of-attendance',
  templateUrl: './list-of-attendance.component.html',
  styleUrls: ['./list-of-attendance.component.scss']
})
export class ListOfAttendanceComponent implements OnInit {
  selectedEmployee: number | undefined;
  employees: any[] = [];
  employeeDetails: any = null;
  attendanceDetails: AttendanceDetails[] = [];
  selectedMonth!: number;
  totalAttendance!: number;

  constructor(private hrmsApiService: HrmsApiService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.hrmsApiService.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.hrmsApiService.employeebyId(this.selectedEmployee).subscribe(
      (employee: any) => {
        this.employeeDetails = employee;
        console.log('Employee attendance details:', this.employeeDetails.employee.attendances);
        this.filterAttendancesByMonth();
        this.calculateTotalAttendance(this.employeeDetails.employee.attendances);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  filterAttendancesByMonth(): void {
    if (!this.employeeDetails || !this.selectedMonth) {
      return;
    }
  
    const selectedMonthNumber = this.selectedMonth;
    console.log(selectedMonthNumber);
    
    const filteredAttendances = this.employeeDetails.employee.attendances.filter((attendance: { checkIn: string | number | Date; }) => {
      const checkInTimestamp = new Date(attendance.checkIn);
      return checkInTimestamp.getMonth()  === selectedMonthNumber - 1; 
    });
  
    this.attendanceDetails = filteredAttendances; 
    console.log(this.attendanceDetails)
  }
  
  calculateTotalAttendance(attendances: any[]): number {
    if (!attendances) {
      return 0;
    }
    const selectedMonthNumber = this.selectedMonth;
    const filteredAttendances = attendances.filter((attendance: { checkIn: string | number | Date }) => {
      const checkInTimestamp = new Date(attendance.checkIn);
      return checkInTimestamp.getMonth() === selectedMonthNumber - 1;
    });
    this.totalAttendance = filteredAttendances.length;
    console.log(this.totalAttendance);  
    return this.totalAttendance;
  }
  
  downloadPDF(): void {
    const doc = new jsPDF();
  
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const selectedMonth = monthNames[this.selectedMonth - 1]; // Adjust index
  
    let y = 20; // Initial y position for text
  
    // Title
    doc.setFontSize(32);
    doc.setTextColor("#4CAF50"); // Green
    doc.setFont("times", "bold");
    doc.text("Employee Attendance Report", 105, y, { align: "center" });
    y += 20;
  
    // Subtitle with date
    doc.setFontSize(18);
    doc.setTextColor("#333"); // Dark gray
    doc.setFont("times", "normal");
    doc.text(`Month: ${selectedMonth}`, 105, y, { align: "center" });
    y += 15;
  
    // Line
    doc.setLineWidth(0.5);
    doc.setDrawColor("#999"); // Light gray
    doc.line(0, y, 230, y);
    y += 10;
  
    // Fetch data for selected employee
    this.hrmsApiService.employeebyId(this.selectedEmployee).subscribe(
      (employeeData: any) => {
        const totalAttendance = this.calculateTotalAttendance(employeeData.employee.attendances);
        const weekdaysAttendance = this.calculateWeekdaysAttendance(employeeData.employee.attendances);
        const weekendsAttendance = this.calculateWeekendsAttendance((new Date()).getMonth()); // Calculate weekends for the current month
  
        // Calculate total working days including weekends
        const totalWorkingDays = totalAttendance + weekendsAttendance;
  
        // Add border
        doc.setDrawColor("#333"); // Dark gray
        doc.setLineWidth(0.5);
        doc.rect(20, y - 5, 170, 49, "S"); // S for "stroke"
  
        // Employee details
        doc.setFontSize(14);
        doc.setTextColor("#2c3e50"); // Dark blue
        doc.setFont("times", "bold");
        doc.text(`Employee Name: ${employeeData.employee.username}`, 25, y);
        y += 10;
        doc.setTextColor("#e74c3c"); // Red
        doc.setFont("times", "normal");
        doc.text(`Total Working Days: ${totalAttendance} + ${weekendsAttendance} = ${totalWorkingDays}`, 25, y); // Adjust here
        y += 10;
        doc.text(`Weekdays Present: ${weekdaysAttendance.present}`, 25, y);
        y += 10;
        doc.text(`Weekdays Absent: ${weekdaysAttendance.absent}`, 25, y);
        y += 10;
        doc.text(`Weekends (Sundays): ${weekendsAttendance}`, 25, y);
        y += 15;
  
        // Save PDF
        doc.save('attendance_report.pdf');
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  


  calculateWeekdaysAttendance(attendances: any[]): { present: number; absent: number } {
    let present = 0;
    let absent = 0;
    attendances.forEach((attendance) => {
      const checkInTimestamp = new Date(attendance.checkIn);
      if (checkInTimestamp.getDay() !== 0) { // Exclude Sundays
        if (attendance.checkOut !== null) {
          present++;
        } else {
          absent++;
        }
      }
    });
    return { present, absent };
  }

  
  calculateWeekendsAttendance(month: number): number {
    // Define an object to store hardcoded Sundays count for each month
    const hardcodedWeekends: { [key: number]: number } = {
      0: 4,  // January
      1: 4,  // February
      2: 5,  // March
      3: 4,  // April
      4: 5,  // May
      5: 5,  // June
      6: 4,  // July
      7: 5,  // August
      8: 5,  // September
      9: 10,  // October
      10: 4, // November
      11: 6, // December
    };
  
    // Get the hardcoded Sundays count for the given month
    const sundaysCount = hardcodedWeekends[month];
  
    return sundaysCount;
  }
  
  downloadAllEmployeesPDF(): void {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Initialize the PDF document
    const doc = new jsPDF();
  
    // Set initial y position for text
    let y = 20;
  
    // Set font styles
    doc.setFont('helvetica', 'normal');
  
    // Set font size for employee name
    doc.setFontSize(16);
  
    // Iterate over each employee
    this.employees.forEach((employee, index) => {
      // Fetch data for the current employee
      this.hrmsApiService.employeebyId(employee.empId).subscribe(
        (employeeData: any) => {
          // Extract employee details
          const employeeName = employeeData.employee.username;
          const totalAttendance = this.calculateTotalAttendance(employeeData.employee.attendances);
          const weekdaysAttendance = this.calculateWeekdaysAttendance(employeeData.employee.attendances);
          const monthIndex = (new Date()).getMonth(); // Get current month index
          const weekendsAttendance = this.calculateWeekendsAttendance(monthIndex); // Calculate weekends for the current month
  
          // Set font size for attendance details
          doc.setFontSize(12);
          const totalWorkingDays = weekdaysAttendance.present + weekendsAttendance;
  
          // Generate content for the current employee
          const content = `
            Employee Name: ${employeeName}
            Total Working Days: ${weekdaysAttendance.present} + ${weekendsAttendance} = ${totalWorkingDays}
            Weekdays Present: ${weekdaysAttendance.present}
            Holidays (Sundays Included): ${weekendsAttendance}
          `;
  
          // Check if content exceeds the page height
          const pageHeight = doc.internal.pageSize.height;
          const lineHeight = doc.getTextDimensions(content).h;
          if (y + lineHeight > pageHeight - 20) {
            // If content exceeds the page height, add a new page
            doc.addPage();
            y = 20; // Reset y position for the new page
          }
  
          // Add content to the PDF document
          doc.text(content, 10, y);
  
          // Add border around the content
          doc.rect(8, y - 5, 190, 40);
  
          // Increase y position for the next employee
          y += 50; // Adjust as needed for spacing between employees
  
          // If this is the last employee, save the PDF
          if (index === this.employees.length - 1) {
            doc.save('all_employees_attendance_report.pdf');
          }
        },
        (error: any) => {
          console.error('Error fetching employee details:', error);
        }
      );
    });
  }
  
  
}
