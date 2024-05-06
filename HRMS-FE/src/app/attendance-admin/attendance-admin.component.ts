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
  selector: 'app-attendance',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.scss']
})
export class AttendanceAdminComponent {
  employees: EmployeeData[] = [];
  selectedMonth!: number;
  attendanceDetails: any;
  employeeDetails: any;
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
    0: 4,  // January
    1: 4,  // February
    2: 5,  // March
    3: 4,  // April
    4: 4,  // May
    5: 5,  // June
    6: 4,  // July
    7: 4,  // August
    8: 5,  // September
    9: 4,  // October
    10: 4, // November
    11: 5, // December
  };

  constructor(private hrmsApiService: HrmsApiService) {}

  fetchEmployeeData(): void {
    this.hrmsApiService.allAttendancebyMonth(this.selectedMonth).subscribe(
      (response: any[]) => {
        this.attendanceDetails = response;
        console.log('Employee attendance details:', this.attendanceDetails);

        this.employees = this.attendanceDetails.map((item: any) => {
          return {
            empId: item.employee.empId,
            firstName: item.employee.firstName,
            lastName: item.employee.lastName,
            attendances: item.attendances
          } as EmployeeData; // Convert to EmployeeData
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

    // Add content to the PDF
    doc.text('Employee Attendance Report', 105, 10, { align: 'center' });
    doc.text(`Selected Month: ${this.getMonthName(this.selectedMonth)}`, 105, 20, { align: 'center' });

    let y = 30; // Initial y position for the table

    // Define column widths for the table
    const columnWidths = [55, 30, 30, 30, 30]; // Adjust as needed

    // Define table header
    const headers = [
        { label: 'Employee Name', width: columnWidths[0] },
        { label: 'PD', width: columnWidths[1] },
        { label: 'Holidays', width: columnWidths[2] },
        { label: 'WO', width: columnWidths[3] },
        { label: 'AD', width: columnWidths[4] }
    ];

    // Set font size for table header
    doc.setFontSize(12);

    // Generate table header
    headers.forEach((header, index) => {
        doc.text(header.label, 10 + index * (columnWidths[index] + 5), y + 8); // Center text vertically
    });

    y += 10; // Move to next row

    // Iterate over each employee
    this.employees.forEach((employee, index) => {
        // Extract employee details
        const employeeName = `${employee.firstName} ${employee.lastName}`;

        // Use hardcoded arrays for calculation
        const presentDays = this.countAttendanceDays(employee); // Count of present days
        const holidaysCount = this.hardcodedHolidays[this.selectedMonth];
        const weekendsAttendance = this.hardcodedWeekends[this.selectedMonth];
        const totalDays = this.hardcodedWorkingDays[this.selectedMonth];

        // Calculate week offs
        const weekOffs = totalDays - (presentDays + holidaysCount + weekendsAttendance);

        // Calculate absent days
        const absentDays = totalDays - (presentDays + holidaysCount + weekOffs);

        // Generate table row for the current employee
        const rowData = [
            { value: employeeName, width: columnWidths[0] },
            { value: presentDays.toString(), width: columnWidths[1] },
            { value: holidaysCount.toString(), width: columnWidths[2] },
            { value: absentDays.toString(), width: columnWidths[3] }, // Switched 'AD' with 'WO'
            { value: weekOffs.toString(), width: columnWidths[4] } // Switched 'WO' with 'AD'
        ];

        // Set font size for table body
        doc.setFontSize(10);

        // Generate table row
        rowData.forEach((data, index) => {
            doc.text(data.value, 10 + index * (columnWidths[index] + 5), y + 8); // Center text vertically
        });

        y += 10; // Move to next row
    });

    // Save the PDF
    doc.save('all_employees_attendance_report.pdf');
}

  getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month -1 ];
  }
}
