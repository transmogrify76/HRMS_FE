import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
export interface LeaveDetails {
  startdate: number;
  enddate: number;
  reason: string;
}
export interface Employee {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
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

  constructor(private http: HrmsApiService) {
  }
  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.http.getAllEmployees().subscribe(
      (employees:Employee[]) => {
        console.log(employees);
        this.employees = employees;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.http.getEmployeeDetails(this.selectedEmployee).subscribe(
      (employee: Employee) => {
        this.employeeDetails = employee;
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
    this.http.getLeaveDetails(this.selectedEmployee).subscribe(
      (leaveDetails: LeaveDetails | LeaveDetails[]) => {
        if (Array.isArray(leaveDetails)) {
          this.leaveDetails = leaveDetails;
        } else {
          this.leaveDetails = [leaveDetails];
        }
      },
      (error) => {
        console.error('Error fetching leave details:', error);
      }
    );
  }
}