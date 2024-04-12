import { Component } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-leaves-for-employee',
  templateUrl: './leaves-for-employee.component.html',
  styleUrls: ['./leaves-for-employee.component.scss']
})
export class LeavesForEmployeeComponent {
  pendingLeaves!: any; // Define pendingLeaves property
  empId!: number;
  hrmsApiService: any;

  constructor(private hrmsapiservice: HrmsApiService) { }

  ngOnInit(): void {
    this.leaverequest();
  }
  leaverequest(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    console.log('-============-',this.empId);
    
    this.hrmsapiservice.getLeaveDetails(this.empId).subscribe(
      (data: any) => {

        this.pendingLeaves = data;
        console.log('-============-', this.pendingLeaves.leaves);
      
  
      }
    );
  }
}
