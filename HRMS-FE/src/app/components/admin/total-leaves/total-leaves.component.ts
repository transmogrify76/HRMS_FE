import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-total-leaves',
  templateUrl: './total-leaves.component.html',
  styleUrls: ['./total-leaves.component.scss']
})
export class TotalLeavesComponent implements OnInit {

  employees: any;
  showSpinner: boolean = false;
  selectedEmployee!: number;
  employeeDetails: any = null;
  leaveDetails: any;


  constructor(private http: HrmsApiService , private toastr: ToastrService) {}

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
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

}
