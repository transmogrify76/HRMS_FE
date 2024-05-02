import { Component } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';


interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  attendances: any[]; 
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.scss']
})
export class AttendanceAdminComponent {
  
  employees: Employee[] = [];

  selectedMonth!: number;
  attendanceDetails: any;
  constructor(private hrmsApiService: HrmsApiService) {}
  fetchEmployeeData(){
    
    this.hrmsApiService.allAttendancebyMonth(this.selectedMonth).subscribe(
      (response: any) => {
        this.attendanceDetails = response;
        console.log('Employee attendance details:',  this.attendanceDetails );
        
        this.employees = this.attendanceDetails.map((item: any) => {
          return {
            empId: item.employee.empId,
            firstName: item.employee.firstName,
            lastName: item.employee.lastName,
            attendances: item.attendances
          };
        });
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  
  }
  countAttendanceDays(employee: Employee): number {
    return employee.attendances.length;
  }
}
