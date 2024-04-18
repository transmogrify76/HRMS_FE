import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  employeeDetails: any;
  empId: number = 0;
  currentWorkingDays: number = 0;
  leaveBalance: number = 0;
  username:any;

  constructor(private http: HrmsApiService) { }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
  }

  fetchEmployeeDetails(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.username=sessionStorage.getItem('username')

    this.http.getEmployeeDetails(this.empId).subscribe(
      (employee) => {
        this.employeeDetails = employee;
        console.log('====-----====', this.employeeDetails.employee);

        // Extract Aadhar card number, bank account number, and IFSC code from the last element of employeedetails array
        const lastIndex = this.employeeDetails.employee.employeedetails.length - 1;
        const lastEmployeeDetail = this.employeeDetails.employee.employeedetails[lastIndex];
        this.employeeDetails.employee.adhaarCardNo = lastEmployeeDetail.adhaarCardNo;
        this.employeeDetails.employee.bankAccountNo = lastEmployeeDetail.bankAccountNo;
        this.employeeDetails.employee.IFSCno = lastEmployeeDetail.IFSCno;
        this.employeeDetails.employee.panNo = lastEmployeeDetail.panNo;

        // Call function to calculate current working days
        this.calculateCurrentWorkingDays();

        // Check if current working days crossed 180 and credit leaves
        if (this.currentWorkingDays > 180) {
          this.creditLeaves(6); // Credit 6 leaves
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  calculateCurrentWorkingDays(): void {
    const joiningDate = this.employeeDetails.employee.joiningDate;
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in yyyy-mm-dd format
    this.currentWorkingDays = this.calculateWorkingDays(joiningDate, currentDate);
  }

  calculateWorkingDays(joiningDate: string, currentDate: string): number {
    const joinDate = new Date(joiningDate);
    const endDate = new Date(currentDate);
    const timeDifference = endDate.getTime() - joinDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
  }

  creditLeaves(numLeaves: number): void {
    if (this.currentWorkingDays < 180) {
      this.leaveBalance = 0;
    } else {
      this.leaveBalance = numLeaves;
    }
  }
}
