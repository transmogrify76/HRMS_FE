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
  
    const lastMonth = monthNames[new Date().getMonth() - 1];
  
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
    doc.text(`Month: ${lastMonth}`, 105, y, { align: "center" });
    y += 15;
  
    // Line
    doc.setLineWidth(0.5);
    doc.setDrawColor("#999"); // Light gray
    doc.line(20, y, 190, y);
    y += 10;
  
    // Fetch data for all employees
    this.hrmsApiService.getEmployees().subscribe(
      (response: any) => {
        const employeesData = response.employees;
        employeesData.forEach((employee: any, index: number) => {
          this.hrmsApiService.employeebyId(employee.empId).subscribe(
            (employeeData: any) => {
              const totalAttendance = this.calculateTotalAttendance(employeeData.employee.attendances);
  
              // Add border
              doc.setDrawColor("#333"); // Dark gray
              doc.setLineWidth(0.5);
              doc.rect(20, y - 5, 170, 35, "S"); // S for "stroke"
  
              // Employee details
              doc.setFontSize(14);
              doc.setTextColor("#2c3e50"); // Dark blue
              doc.setFont("times", "bold");
              doc.text(`Employee Name: ${employeeData.employee.username}`, 25, y);
              y += 10;
              doc.setTextColor("#e74c3c"); // Red
              doc.setFont("times", "normal");
              doc.text(`Total Attendance: ${totalAttendance} days`, 25, y);
              y += 15;
  
              if (index === employeesData.length - 1) {
                // Save PDF when all employees' data is added
                doc.save('attendance_report.pdf');
              }
            },
            (error: any) => {
              console.error('Error fetching employee details:', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  
  
  
}
