import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  employeeDetails: any;
  empId : number = 0;

  constructor(private http: HrmsApiService) { }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
  }
  
  fetchEmployeeDetails(): void {
    this.empId = Number(sessionStorage.getItem('empId'));

    this.http.getEmployeeDetails(this.empId).subscribe(
      (employee) => {
        this.employeeDetails = employee;
        console.log('====-----====' , this.employeeDetails.employee);
        
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
}
