import { Component, OnInit,Pipe, PipeTransform} from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


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
  selectedLeaveStatus = '';
  showSpinner = false;
  selectedMonth!: number;
  totalAttendance!: number;

  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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
        this.calculateTotalAttendance();
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
      return checkInTimestamp.getMonth()  === selectedMonthNumber-1; 
    });
  
    this.attendanceDetails = filteredAttendances; 
    console.log(this.attendanceDetails)
  }
  
  calculateTotalAttendance(): void {
    if (!this.attendanceDetails) {
      return;
    }
    this.totalAttendance = this.attendanceDetails.length;
    console.log(this.totalAttendance);
    
  }
  
}

