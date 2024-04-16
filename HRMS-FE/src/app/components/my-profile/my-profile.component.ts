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

  constructor(private http: HrmsApiService) { }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
  }

  fetchEmployeeDetails(): void {
    this.empId = Number(sessionStorage.getItem('empId'));

    this.http.getEmployeeDetails(this.empId).subscribe(
      (employee) => {
        this.employeeDetails = employee;
        console.log('====-----====', this.employeeDetails.employee);

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

    let workingDays = daysDifference;
    const startDate = new Date(joinDate);
    for (let i = 0; i <= daysDifference; i++) {
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            workingDays--;
        }
        startDate.setDate(startDate.getDate() + 1);
    }

    return workingDays; // Return the calculated working days
  }

  creditLeaves(numLeaves: number): void {
    // Implement logic to credit leaves here
    // You can call a service to credit the leaves to the employee
    // For example:
    // this.http.creditLeaves(this.empId, numLeaves).subscribe(
    //   (response) => {
    //     console.log('Leaves credited successfully:', response);
    //   },
    //   (error) => {
    //     console.error('Error crediting leaves:', error);
    //   }
    // );
    // For now, let's just log a message to simulate the leaves being credited
    console.log(`${numLeaves} leaves credited to employee.`);
  }
}
