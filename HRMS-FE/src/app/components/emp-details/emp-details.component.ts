import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emp-details',
  templateUrl: './emp-details.component.html',
  styleUrls: ['./emp-details.component.scss']
})
export class EmpDetailsComponent {

  adhaarCardNo: String | null = null;
  bankAccountNo: string | null = null;
  IFSCno: string | null = null;
  submitted: boolean = false;
  showSpinner!: boolean;
  empId: any;


  constructor(
    private toastr: ToastrService,
    private hrmsService: HrmsApiService,
    public router:Router
  ) {}


  empdetails() {
    this.submitted = true;
    this.showSpinner = true; 
    if (!this.adhaarCardNo || !this.bankAccountNo) {
      console.error('Please select adhaarCardNo and bankAccountNo.');
      return;
    }
    this.empId=Number(sessionStorage.getItem('empId'));
    console.log('==========', this.empId);
    

    const payload = {
      adhaarCardNo: this.adhaarCardNo,
      bankAccountNo: this.bankAccountNo,
      IFSCno: this.IFSCno,
      employee:this.empId
    };

    

    this.hrmsService.empdetails(payload).subscribe(
      (data: any) => {
        console.log(payload);
        if (data || data.statusCode === 200) {
          this.submitted = true;
          this.toastr.success('Details uploaded', 'Success', { positionClass: 'toast-top-center' });
        } else {
          console.error('Uploaded failed');
        }
      },
      (error: any) => {
        console.error('Error occurred while Details upload:', error);
        this.toastr.error('Uploaded failed',  'Error', { positionClass: 'toast-top-center' }); 
      },
      () => {
        // Hide spinner after 2 seconds
        setTimeout(() => {
          this.showSpinner = false;
          this.router.navigate(['/home']);
        }, 2000);
      }
    );
  }
}


