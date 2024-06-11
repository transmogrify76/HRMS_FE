import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  employeeDetails: any;
  empId: number = 0;
  currentWorkingDays: number = 0;
  leaveBalance: number = 0;
  username: any;
  profilePicture: string | undefined;
  imgId: number = 0;
  isUploading: boolean = false;

  constructor(private http: HrmsApiService , private cookieService: CookieService) { }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
    this.retrieveAndDisplayProfilePic();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.http.uploadProfilePic(file).subscribe(
        (response: any) => {
          const imageId = response.id;
          this.cookieService.set('profileImageId', imageId.toString());
          this.imgId = imageId;
          this.getProfilePic(this.imgId);
        },
        (error: any) => {
          console.error('File upload failed', error);
          this.isUploading = false;
        }
      );
    }
  }

  getProfilePic(imageId: number) {
    if (imageId) {
      this.http.getProfilePicture(imageId).subscribe(
        (profilePictureResponse: Blob) => {
          this.profilePicture = URL.createObjectURL(profilePictureResponse);
          this.isUploading = false;
        },
        (error: any) => {
          console.error('Error fetching profile picture:', error);
          this.isUploading = false;
        }
      );
    }
  }

  retrieveAndDisplayProfilePic() {
    const profileImageIdString = this.cookieService.get('profileImageId');
    if (profileImageIdString) {
      const profileImageId = Number(profileImageIdString);
      this.getProfilePic(profileImageId);
    }
  }
  

  fetchEmployeeDetails(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.username = sessionStorage.getItem('username');

    this.http.getEmployeeDetails(this.empId).subscribe(
      (employee) => {
        this.employeeDetails = employee;

        if (this.employeeDetails.employee.employeedetails.length > 0) {
          this.employeeDetails.employee.bankAccountNo = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].bankAccountNo;
          this.employeeDetails.employee.IFSCno = this.employeeDetails.employee.employeedetails[this.employeeDetails.employee.employeedetails.length - 1].IFSCno;
          
        }

        this.calculateCurrentWorkingDays();
        if (this.currentWorkingDays > 180) {
          this.creditLeaves(6); 
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  calculateCurrentWorkingDays(): void {
    const joiningDate = this.employeeDetails.employee.joiningDate;
    const currentDate = new Date().toISOString().split('T')[0]; 
    this.currentWorkingDays = this.calculateWorkingDays(joiningDate, currentDate);
  }

  calculateWorkingDays(joiningDate: string, currentDate: string): number {
    const joinDate = new Date(joiningDate);
    const endDate = new Date(currentDate);

    const timeDifference = endDate.getTime() - joinDate.getTime();

    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    const weekends = this.countWeekendDays(joinDate, endDate);

    const workingDays = daysDifference;

    return workingDays;
  }

  countWeekendDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }

  creditLeaves(numLeaves: number): void {
    if (this.currentWorkingDays < 180) {
      this.leaveBalance = 0;
    } else {
      this.leaveBalance = numLeaves;
    }
  }
}
