import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-emp-payrolls',
  templateUrl: './emp-payrolls.component.html',
  styleUrls: ['./emp-payrolls.component.scss']
})
export class EmpPayrollsComponent {
  employeeDetails: any = null;
  employee: any;
  empId: any;
  filterdata: any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedmonth: string = '';
  filterdata1: any;
  payrollDetailsForm!: FormGroup;

  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor(
    private hrmsApiService: HrmsApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeData();
    this.initForm();
  }

  initForm() {
    this.payrollDetailsForm = this.fb.group({
      basicSalary: '',
      HRA: '',
      CityAllowance: '',
      Con_Allowance: '',
      Other: '',
      Total_Earnings: '',
      Provident_Fund: '',
      Professional_Tax: '',
      ESI_Mediclaim: '',
      otherdeduction: '',
      transferred_amount: '',
      totaldeduction: '',
    });
  }

  showcaseEarnings(): void {
    const formValue = this.filterdata;
    const otherdeduction = formValue.otherdeduction == 0 ? 'N/A' : formValue.otherdeduction;
    const Provident_Fund = formValue.Provident_Fund == 0 ? 'N/A' : formValue.Provident_Fund;
    const ESI_Mediclaim = formValue.ESI_Mediclaim == 0 ? 'N/A' : formValue.ESI_Mediclaim;
    this.payrollDetailsForm.patchValue(formValue);
    this.payrollDetailsForm.patchValue({
      Provident_Fund: Provident_Fund,
      ESI_Mediclaim: ESI_Mediclaim,
      otherdeduction: otherdeduction,
    });
  }

  fetchEmployeeData(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.hrmsApiService.employeebyId(this.empId).subscribe(
      (employee: any) => {
        this.employeeDetails = employee.employee.payrolldetails;
        this.employee = employee.employee;
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  filter() {
    if (this.selectedmonth) {
      this.filterdata1 = this.employeeDetails.filter((data: { month: any; }) => data.month == this.selectedmonth);
      this.filterdata = this.filterdata1[0];
      console.log('Filtered data:', this.filterdata);
    }
  }

  downloadPdf(): void {
    const element = this.content?.nativeElement;
  if (!element) {
    console.error('Content element is not available');
    return;
  }
    const scale = 3.3;
  
  html2canvas(element, { scale: scale }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width * scale; // Adjusted width based on scale factor
    const imgHeight = canvas.height * scale; // Adjusted height based on scale factor
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2; // Centering the content
    const imgY = (pdfHeight - imgHeight * ratio) / 3;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('payslip.pdf');
  });
}
  
  
}
