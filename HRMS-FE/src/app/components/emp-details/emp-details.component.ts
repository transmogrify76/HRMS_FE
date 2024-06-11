import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.scss']
})
export class EmpDetailsComponent implements OnInit {
  empDetailsForm: FormGroup;
  employees: any;
  selectedEmployee: number = 0;
  submitted: boolean = false;
  showSpinner: boolean = false;
  employeeDetails: any = null;
  empId: number | null = null;
  bankAccountNo: any = null;
  ifsc: any = null;
  bankAccountName: any = null

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private hrmsService: HrmsApiService,
    public router: Router,
  ) {
    this.empDetailsForm = this.formBuilder.group({
      bankAccountNo: [''],
      IFSCno: [''],
      bankAccountName: ['']
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.hrmsService.getAllActiveEmployees().subscribe(
      (response: any) => {
        this.employees = response.employees;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  fetchEmployeeData(): void {
    this.hrmsService.employeebyId(this.selectedEmployee).subscribe(
      (employee: any) => {
        this.employeeDetails = employee;
        this.empId = this.employeeDetails.employee.empId;
  
        if (this.employeeDetails.employee.employeedetails && this.employeeDetails.employee.employeedetails.length > 0) {
          const lastEntry = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1];
          const bankAccountNo = lastEntry.bankAccountNo;
          const ifsc = lastEntry.IFSCno;
          const bankAccountName = lastEntry.bankAccountName
  
          // Update form controls with new values
          if (bankAccountNo && ifsc && bankAccountName) {
            this.empDetailsForm.patchValue({
              bankAccountNo: bankAccountNo,
              IFSCno: ifsc,
              bankAccountName: bankAccountName
            });
          }
        } else {
          // Reset form controls to empty values
          this.empDetailsForm.patchValue({
            bankAccountNo: '',
            IFSCno: '',
            bankAccountName: ''
          });
        }
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  

  empdetails(): void {
    this.submitted = true;

    if (this.empDetailsForm.invalid) {
      this.toastr.error('Please fill all the required fields correctly.', 'Invalid Input', { positionClass: 'toast-top-center' });
      return;
    }

    this.showSpinner = true;
    const payload = {
      bankAccountNo: this.empDetailsForm.value.bankAccountNo,
      IFSCno: this.empDetailsForm.value.IFSCno,
      employee: this.empId,
      bankAccountName:this.empDetailsForm.value.bankAccountName
    };

    this.hrmsService.empdetails(payload).subscribe(
      (data: any) => {
        if (data || data.statusCode === 200) {
          this.toastr.success('Details uploaded', 'Success', { positionClass: 'toast-top-center' });
        } else {
          console.error('Upload failed');
        }
      },
      (error: any) => {
        console.error('Error occurred while uploading details:', error);
        this.toastr.error('Upload failed', 'Error', { positionClass: 'toast-top-center' });
      },
      () => {
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigate(['/home']);
        }, 2000);
      }
    );
  }
}
