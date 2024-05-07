import { Component } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-emp-payrolls',
  templateUrl: './emp-payrolls.component.html',
  styleUrls: ['./emp-payrolls.component.scss']
})
export class EmpPayrollsComponent {
  
  employeeDetails: any = null;
  empId:any;
  filterdata:any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedmonth: string = '';
  filterdata1:any;

  constructor(
    private hrmsApiService: HrmsApiService,
  ) {}
  ngOnInit(): void {
    this.fetchEmployeeData()
  }
  fetchEmployeeData(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.employeebyId(this.empId).subscribe(
      (employee: any) => {
        this.employeeDetails = employee.employee.payrolldetails;
        console.log('Employee details:', this.employeeDetails);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  filter(){
     if(this.selectedmonth){
      this.filterdata1=this.employeeDetails.filter((data: { month: any; }) => data.month == this.selectedmonth)
      this.filterdata=this.filterdata1[0];
      console.log(this.filterdata)


     }
  }
}
