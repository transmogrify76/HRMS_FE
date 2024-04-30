import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-fetch-salary',
  templateUrl: './fetch-salary.component.html',
  styleUrls: ['./fetch-salary.component.scss']
})
export class FetchSalaryComponent implements OnInit {

  selectedEmployee!: number;
  employees: any;
  empId: number | undefined;




  constructor(private hrmsService: HrmsApiService) { }
  ngOnInit() {
    this.fetchEmployees();
  }


  fetchEmployees(): void {
    this.hrmsService.getEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    console.log('=========', this.selectedEmployee);
    
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (employee: any) => {
        this.empId = employee?.employee?.empId;
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
}
