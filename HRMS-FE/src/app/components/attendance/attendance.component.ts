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
  attendanceDetails: any;
  empId: number = 0;
  selectedLeaveStatus = '';
  showSpinner = false;

  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }
  fetchEmployeeData(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.getattendance(this.empId).subscribe(
      (employee: any) => {
        this.employeeDetails = employee;
        console.log('Employee details:', this.employeeDetails.attendances);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
}
