import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// export interface LeaveDetails {
//   startdate: number;
//   enddate: number;
//   reason: string;
// }

// export interface Employee {
//   empId: number;
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  selectedEmployee!: number;
  // employees: Employee[] = [];
  employees: any;
  leavecount:any;
  employeeDetails: any = null;
  leaveDetails: any;
  employee: any;
  empId: number = 0;
  selectedLeaveStatus: string[] = [];
  showSpinner: boolean = false;

  constructor(private http: HrmsApiService ,private router: Router, private toastr: ToastrService) {}

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
        this.empId = this.employeeDetails.employee.empId;
        this.leavecount = this.employeeDetails.employee.leaveCount
        console.log(this.leavecount)
        console.log('ppppppppppppppppp', this.employeeDetails.employee.empId);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
    this.http.getLeaveDetails(this.selectedEmployee).subscribe(
      (leaveDetails: any) => {
        if (Array.isArray(leaveDetails)) {
          this.leaveDetails = leaveDetails;
          console.log('ppppppppppppppppp', this.leaveDetails);
          
        } else {
          this.leaveDetails = [leaveDetails];
        }
      },
      (error: any) => {
        console.error('Error fetching leave details:', error);
      }
    );
  }

  initializeSelectedLeaveStatuses() {
    this.selectedLeaveStatus = this.employeeDetails.employee.leaves.map(() => 'PENDING');
}

  updateLeaveStatus(leaveId: number, selectedLeaveStatus: string) {

    if (selectedLeaveStatus) {
      const payload = { 
        leaveStatus: selectedLeaveStatus ,
        // empId : this.empId
      };
      this.showSpinner = true;
  
      // Simulate a delay of 2 seconds before making the HTTP request
      setTimeout(() => {
        this.http.updateLeaveStatus(leaveId, this.empId, payload).subscribe(
          (response: any) => {
            console.log('Leave status updated successfully:', response);
            this.showSpinner = false;
  
            // Display toaster message based on the selectedLeaveStatus
            if (selectedLeaveStatus === 'APPROVED') {
              this.toastr.success('Leave approved successfully', '', { positionClass: 'toast-top-center' });
            } else if (selectedLeaveStatus === 'REJECTED') {
              this.toastr.error('Leave rejected', '', { positionClass: 'toast-top-center' });
            }
            this.router.navigateByUrl('/home');
          },
          (error: any) => {
            console.error('Error updating leave status:', error);
            this.showSpinner = false;
            this.toastr.error('Error updating leave status', '', { positionClass: 'toast-top-center' });
            this.router.navigateByUrl('/home');
          }
        );
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }
  
  }

