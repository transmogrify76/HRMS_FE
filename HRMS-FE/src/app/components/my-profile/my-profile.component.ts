import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

export interface Employee {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  employeeDetails: Employee = {} as Employee;

  constructor(private http: HrmsApiService) { }

  ngOnInit(): void {
    // Call fetchEmployeeDetails function when the component initializes
    this.fetchEmployeeDetails();
  }

  fetchEmployeeDetails(): void {
    const selectedEmployeeId = 1; 

    // Call the service function to fetch employee details
    // this.http.getEmployeeDetails(selectedEmployeeId).subscribe(
    //   (employee: Employee) => {
    //     // Update employeeDetails with the response from the service
    //     this.employeeDetails = employee;
    //   },
    //   (error) => {
    //     console.error('Error fetching employee details:', error);
    //   }
    // );
  }
}
