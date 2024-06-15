import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  selectedEmployee: number | undefined;
  employees: any[] = [];
  employeeDetails: any = null;
  combinedData: any[] = []; // Array to combine attendance and leave data
  empId: number = 0;
  selectedLeaveStatus = '';
  showSpinner = false;

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];

  constructor(
    private hrmsApiService: HrmsApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeData();
  }

  fetchEmployeeData(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.employeebyId(this.empId).subscribe(
      (employee: any) => {
        this.employeeDetails = {
          attendances: employee.employee.attendances || [],
          leaves: employee.employee.leaves || []
        };

        console.log('Attendances:', this.employeeDetails.attendances); // Log attendances
        console.log('Leaves:', this.employeeDetails.leaves);

        this.combineData(); // Call method to combine attendance and leave data
        console.log('Employee details:', this.employeeDetails);
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  combineData(selectedMonth?: string): void {
    if (this.employeeDetails && this.employeeDetails.attendances && this.employeeDetails.leaves) {
      if (selectedMonth) {
        // Filter attendances for the selected month
        const filteredAttendances = this.employeeDetails.attendances.filter((attendance: any) => {
          const checkInDate = new Date(attendance.checkIn);
          return (checkInDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
        });
  
        // Filter leaves for the selected month
        const filteredLeaves = this.employeeDetails.leaves.filter((leave: any) => {
          const startDate = new Date(leave.startDate);
          return (startDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
        });
  
        console.log('Filtered Attendances:', filteredAttendances); // Log filtered attendances
        console.log('Filtered Leaves:', filteredLeaves); // Log filtered leaves
  
        // Combine filtered attendances with matching leaves
        this.combinedData = filteredAttendances.map((attendance: any) => {
          const matchingLeave = filteredLeaves.find((leave: any) => leave.startDate === attendance.checkIn.split('T')[0]);
  
          return {
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            date: attendance.checkIn.split('T')[0], // Adjust date format as needed
            leaveReason: matchingLeave ? matchingLeave.reason : '',
            // Add more properties as needed
          };
        });
      } else {
        // If no month is selected, combine all attendances with corresponding leaves
        this.combinedData = this.employeeDetails.attendances.map((attendance: any) => {
          const matchingLeave = this.employeeDetails.leaves.find((leave: any) => leave.startDate === attendance.checkIn.split('T')[0]);
  
          return {
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            date: attendance.checkIn.split('T')[0], // Adjust date format as needed
            leaveReason: matchingLeave ? matchingLeave.reason : '',
            // Add more properties as needed
          };
        });
      }
  
      console.log('Combined Data:', this.combinedData); // Log combined data after mapping
    }
  }
  
  
  
  
  onMonthChange(event: Event): void {
    const selectedMonth = (event.target as HTMLSelectElement).value;
    if (this.employeeDetails && this.employeeDetails.attendances && this.employeeDetails.leaves) {
      if (selectedMonth === '') {
        // Reset to all attendances with corresponding leaves
        this.combineData();
      } else {
        this.combineData(selectedMonth);
      }
    }
  }
  
  
  
}
