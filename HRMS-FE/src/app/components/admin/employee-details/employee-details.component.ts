import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

export interface LeaveDetails {
startDate: string|number|Date;
  startdate: number;
  enddate: number;
  reason: string;
}

export interface Employee {
  empId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  selectedEmployee!: number;
  employees: Employee[] = [];
  employeeDetails: Employee = {} as Employee;
  leaveDetails: LeaveDetails[] = [];

  constructor(private http: HrmsApiService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.http.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
        console.log('Employees:', this.employees);
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.http.getleavedetails(this.selectedEmployee).subscribe(
      (employee: Employee) => {
        this.employeeDetails = employee;
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );

  }
}
