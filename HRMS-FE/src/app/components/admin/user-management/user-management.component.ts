import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  selectedEmployee!: number;
  employees: any;
  employeeDetails: any = null;
  employee: any;
  showSpinner: boolean = false;
  selectedLeaveStatus: string[] = [];

  constructor(private http: HrmsApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.http.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.http.employeebyId(this.selectedEmployee).subscribe(
      (employee: any) => {
        this.employeeDetails = employee;
        if (this.employeeDetails.employee.employeedetails.length > 0) {
          this.employeeDetails.employee.bankAccountNo = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].bankAccountNo;
          this.employeeDetails.employee.IFSCno = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].IFSCno;
        }
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  toggleStatus(employee: any): void {
    this.showSpinner = true;
    const newStatus = !employee.isActive;    
    const payload = {
      empId : employee.empId,
      isActive : newStatus
    }
    this.http.deactivateUser(payload).subscribe(
      () => {
        console.log(`Employee ${employee.firstName} status set to ${newStatus ? 'Active' : 'Deactive'}`);
        this.showSpinner = false;
      },
      (error: any) => {
        console.error('Error updating employee status:', error);
        this.showSpinner = false;
      }
    );
  }
}
