import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Duration } from 'ngx-bootstrap/chronos/duration/constructor';

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
  remark: string[] = [];
  leaveDuration : number = 0;

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
        this.leavecount = this.employeeDetails.employee.leaveCount;
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
    this.http.getLeaveDetails(this.selectedEmployee).subscribe(
      (leaveDetails: any) => {
        if (Array.isArray(leaveDetails)) {
          this.leaveDetails = leaveDetails;
          
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
  
  updateLeaveStatus(leaveId: number, selectedLeaveStatus: string, duration:number) {
    const remarksString: string = this.remark.join('');
  //   // this.leaveDuration = this.employeeDetails.employee.leaves[leaveId];
  //   if (!this.employeeDetails || !this.employeeDetails.employee || !this.employeeDetails.employee.leaves) {
  //     console.error('Employee details or leaves data is missing.');
  //     this.toastr.error('Employee details or leaves data is missing.', '', { positionClass: 'toast-top-center' });
  //     return;
  // }

  // // Validate leaveId
  // let leaveIndex = this.employeeDetails.employee.leaves.length;
  // if (leaveIndex < 0 || leaveIndex >= this.employeeDetails.employee.leaves.length) {
  //     console.error('Invalid leave ID.');
    
  //     this.toastr.error('Invalid leave ID.', '', { positionClass: 'toast-top-center' });
  //     return;
  // }
  

  // Retrieve the leave duration
  this.leaveDuration = duration;
  console.log(this.leaveDuration)
    
    if (selectedLeaveStatus) {
      const payload = { 
        leaveStatus: selectedLeaveStatus ,
        remark: remarksString
      };
      
      this.showSpinner = true;
      setTimeout(() => {
        this.http.updateLeaveStatus(leaveId, this.empId, payload).subscribe(
          (response: any) => {
            
            // Display toaster message based on the selectedLeaveStatus
            if (selectedLeaveStatus === 'APPROVED') {
              this.leavecount = this.leavecount -  this.leaveDuration;
              const payload = {
                leaveCount : this.leavecount
              }
              this.http.employeeDetailsUpdate(this.empId, payload).subscribe(
                (response: any) => {
                  this.showSpinner = false;
                }
              )
              this.toastr.success('Leave approved successfully', '', { positionClass: 'toast-top-center' });
            } else if (selectedLeaveStatus === 'REJECTED') {
              this.toastr.error('Leave rejected', '', { positionClass: 'toast-top-center' });
            }
            this.router.navigateByUrl('/home');
            this.showSpinner = false;
          },
          (error: any) => {
            console.error('Error updating leave status:', error);
            this.showSpinner = false;
            this.toastr.error('Error updating leave status', '', { positionClass: 'toast-top-center' });
            this.router.navigateByUrl('/home');
          }
        );
      }, 2000);
    }
  }
  
  }

