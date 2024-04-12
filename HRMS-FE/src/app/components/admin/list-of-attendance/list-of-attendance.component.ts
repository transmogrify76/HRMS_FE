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
        console.log('Employee details:', this.employeeDetails.employee.attendances);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
}

