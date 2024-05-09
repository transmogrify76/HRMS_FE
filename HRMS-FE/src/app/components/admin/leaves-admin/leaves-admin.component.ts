import { Component } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { jsPDF } from 'jspdf';

interface Attendance {
  checkOut: string | number | Date;
  checkIn: string | number | Date;
  date: string; // or whatever type it is
  // Other attendance properties
}

interface EmployeeData {
  empId: number;
  firstName: string;
  lastName: string;
  attendances: Attendance[];
}

@Component({
  selector: 'app-leaves-admin',
  templateUrl: './leaves-admin.component.html',
  styleUrls: ['./leaves-admin.component.scss']
})
export class LeavesAdminComponent {
  employees: EmployeeData[] = [];
  selectedMonth!: number;
  attendanceDetails: any;
  employeeDetails: any;
  leavedetails:any;

  hardcodedWorkingDays: { [key: number]: number } = {
    1: 31,  // January
    2: 29,  // February
    3: 31,  // March
    4: 30,  // April
    5: 31,  // May
    6: 30,  // June
    7: 31,  // July
    8: 31,  // August
    9: 30,  // September
    10: 31,  // October
    11: 30, // November
    12: 31,  // December
  };

  hardcodedHolidays: { [key: number]: number } = {
    1: 2,  // January
    2: 0,  // February
    3: 1,  // March
    4: 0,  // April
    5: 1,  // May
    6: 0,  // June
    7: 0,  // July
    8: 1,  // August
    9: 0,  // September
    10: 6,  // October
    11: 0, // November
    12: 1, // December
  };

  hardcodedWeekends: { [key: number]: number } = {
    1: 4,  // January
    2: 4,  // February
    3: 5,  // March
    4: 4,  // April
    5: 4,  // May
    6: 5,  // June
    7: 4,  // July
    8: 4,  // August
    9: 5,  // September
    10: 4,  // October
    11: 4, // November
    12: 5, // December
  };

  constructor(private hrmsApiService: HrmsApiService) {}

  fetchEmployeeData(){
    this.hrmsApiService.allLeavebyMonth(this.selectedMonth).subscribe(
      (response:any) =>{
        this.leavedetails = response;
        console.log(this.leavedetails)

      }
    )
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

  countAttendanceDays(employee: EmployeeData): number {
    return employee.attendances.length;
  }
  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Employee Attendance Report', 105, 10, { align: 'center' });
    doc.text(`Selected Month: ${this.getMonthName(this.selectedMonth)}`, 105, 20, { align: 'center' });

    let y = 30; 

    const columnWidths = [50, 40, 30, 25, 25, 25,25]; // Updated for all columns 

    const headers = [
        { label: 'Emp Name', width: columnWidths[0] },
        { label: 'P', width: columnWidths[1] },
        { label: 'H', width: columnWidths[2] },
        { label: 'Wo', width: columnWidths[3] },
        { label: 'Ab', width: columnWidths[4] },
        { label: 'AL', width: columnWidths[5] },
        { label: 'Tw', width: columnWidths[5] }
    ];

    doc.setFontSize(12);

    headers.forEach((header, index) => {
        doc.text(header.label, 10 + index * (columnWidths[index] + 5), y + 8); 
    });

    y += 10; 

    this.employees.forEach((employee, ) => {
        const presentDays = this.countAttendanceDays(employee); 
        const holidaysCount = this.hardcodedHolidays[this.selectedMonth];
        const weekendsAttendance = this.hardcodedWeekends[this.selectedMonth];
        const totalDays = this.hardcodedWorkingDays[this.selectedMonth];

        const weekOffs = weekendsAttendance;
       

        const leaveDetails = this.leavedetails.find((details: any) => details.employee.empId === employee.empId);

        let totalPendingLeaveDuration = 0;
    if (leaveDetails) {
        leaveDetails.leave.forEach((leave: any) => {
            if (leave.leaveStatus === 'APPROVED') {
                totalPendingLeaveDuration += leave.duration;
            }
        });
    }
        const pendingLeaves = totalPendingLeaveDuration ;
        const absentDays = totalDays - (presentDays + holidaysCount + weekOffs + pendingLeaves);
        const total = (presentDays + holidaysCount + weekOffs + totalPendingLeaveDuration)
        const rowData = [
            { value: `${employee.firstName} ${employee.lastName}`, width: columnWidths[0] },
            { value: presentDays.toString(), width: columnWidths[1] },
            { value: holidaysCount.toString(), width: columnWidths[2] },
            { value: weekOffs.toString(), width: columnWidths[3] },
            { value: absentDays.toString(), width: columnWidths[4] },
            { value: pendingLeaves.toString(), width: columnWidths[5] },
            { value: total.toString(), width: columnWidths[5] }
        ];


        doc.setFontSize(10);

        rowData.forEach((data, index) => {
            doc.text(data.value, 10 + index * (columnWidths[index] + 5), y + 8);
        });

        y += 10; 
    });

    doc.save('employees_attendance_report.pdf');
}




  getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month -1 ];
  }
}
