import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import * as moment from 'moment';

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
  selectedMonth: string = '';

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

  combineData(): void {
    const attendances = this.employeeDetails.attendances.map((att: { checkIn: moment.MomentInput; checkOut: any; }) => ({
      date: moment(att.checkIn).format('YYYY-MM-DD'),
      checkIn: att.checkIn,
      checkOut: att.checkOut,
      status: 'Present'
    }));

    const leaves = this.employeeDetails.leaves.map((leave: { startDate: moment.MomentInput; }) => ({
      date: moment(leave.startDate).format('YYYY-MM-DD'),
      status: 'Leave'
    }));

    const startDate = moment.min(
      attendances.map((a: { date: moment.MomentInput; }) => moment(a.date))
    ).startOf('day');
    const endDate = moment.max(
      attendances.map((a: { date: moment.MomentInput; }) => moment(a.date))
    ).endOf('day');

    // Generate date range
    const dateRange = [];
    for (let m = startDate.clone(); m.isSameOrBefore(endDate); m.add(1, 'days')) {
      dateRange.push(m.format('YYYY-MM-DD'));
    }

    // Hardcoded holidays and weekends
    const holidays = ['2024-01-01','2024-01-26','2024-03-25','2024-05-01','2024-05-25','2024-05-27','2024-06-01','2024-08-15','2024-08-28','2024-10-02','2024-10-10','2024-10-11','2024-10-12','2024-10-14','2024-10-25','2024-11-02','2024-12-25']
    const weekends = dateRange.filter(date => {
      const day = moment(date).day();
      return day === 0 || day === 6;
    });

    // Merge data
    this.combinedData = dateRange.map(date => {
      const attendance = attendances.find((a: { date: string; }) => a.date === date);
      const leave = leaves.find((l: { date: string; }) => l.date === date);
      const isHoliday = holidays.includes(date);
      const isWeekend = weekends.includes(date);

      return {
        date,
        checkIn: attendance ? attendance.checkIn : null,
        checkOut: attendance ? attendance.checkOut : null,
        status: attendance
          ? attendance.status
          : leave
          ? leave.status
          : isHoliday
          ? 'Holiday'
          : isWeekend
          ? 'Weekend'
          : 'Absent'
      };
    });

    // Filter based on selected month
    if (this.selectedMonth) {
      this.combinedData = this.combinedData.filter(data => moment(data.date).format('MM') === this.selectedMonth);
    }
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.target.value;
    this.combineData();
  }
}
