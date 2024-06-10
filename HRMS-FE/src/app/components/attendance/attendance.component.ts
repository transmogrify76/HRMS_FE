import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  selectedEmployee: number | undefined;
  employees: any[] = [];
  employeeDetails: any = null;
  filteredAttendances: any[] = [];
  empId: number = 0;
  selectedLeaveStatus = '';
  showSpinner = false;

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];

  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeData();
  }

  fetchEmployeeData(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.getattendance(this.empId).subscribe(
      (employee: any) => {
        this.employeeDetails = employee;
        this.filteredAttendances = this.employeeDetails.attendances || []; // Initialize filteredAttendances with all attendances or an empty array
        console.log('Employee details:', this.employeeDetails.attendances);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  onMonthChange(event: Event): void {
    const selectedMonth = (event.target as HTMLSelectElement).value;
    if (this.employeeDetails && this.employeeDetails.attendances) {
      if (selectedMonth === '') {
        this.filteredAttendances = this.employeeDetails.attendances; // Reset to all attendances if no month is selected
      } else {
        this.filteredAttendances = this.employeeDetails.attendances.filter((attendance: any) => {
          const checkInDate = new Date(attendance.checkIn);
          return (checkInDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
        });
      }
    }
  }
}
