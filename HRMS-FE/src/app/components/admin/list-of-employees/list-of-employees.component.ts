import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-list-of-employees',
  templateUrl: './list-of-employees.component.html',
  styleUrls: ['./list-of-employees.component.scss']
})
export class ListOfEmployeesComponent implements OnInit {
  selectedEmployee!: number;
  employees: any;
  employeeDetails: any = null;
  employee: any;
  selectedLeaveStatus: string[] = [];

  constructor(private http: HrmsApiService ,private router: Router) {}
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
        console.log('Employee Details:', this.employeeDetails);
        // Fetch Aadhar Card number from the last item in the employeedetails array
        if (this.employeeDetails.employee.employeedetails.length > 0) {
          // Fetch bank account number and IFSC code similarly
          this.employeeDetails.employee.bankAccountNo = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].bankAccountNo;
          this.employeeDetails.employee.IFSCno = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].IFSCno;
          
        }
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

}
