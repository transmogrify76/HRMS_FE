import { Component, OnInit } from '@angular/core';
import { HrmsApiService } from 'src/app/services/hrms-api.service';

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

  constructor(private http: HrmsApiService) { }

  ngOnInit(): void {
    this.fetchEmployeeDetails();
    this.calculateCurrentWorkingDays();

  }

   // Function to handle file selection
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.http.uploadProfilePic(file).subscribe(
        (response: any) => {
          const imageId = response.id; // Extract image ID from the response
          this.imgId = imageId;
          sessionStorage.setItem('ImageID' , imageId);
          console.log('-------------------' , imageId ,  this.imgId) ;          
          this.isUploading = false;
          
        },
        (error: any) => {
          console.error('File upload failed', error);
          this.isUploading = false;
        }
      );
    }
  }

  getProfilePic(){
    this.imgId = Number(sessionStorage.getItem('ImageID'));
    console.log('--------qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq-----------' , this.imgId) ;
    
    
     // After successful upload, fetch the profile picture URL using imageId
    this.http.getProfilePicture(this.imgId).subscribe(
      (profilePictureResponse: any) => {
        this.profilePicture = profilePictureResponse.path;
        console.log('------3333333333333-------------' , this.profilePicture);
        
        this.isUploading = false;
      },
      (error: any) => {
        console.error('Error fetching profile picture:', error);
        this.isUploading = false;
      }
    );
  }
  
  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.isUploading = true;
  //     this.http.uploadProfilePic(file).subscribe(
  //       (response: any) => {
  //         this.profilePicture = response.path; // Set profilePicture directly from the upload response
  //         this.isUploading = false;
  //       },
  //       (error: any) => {
  //         console.error('File upload failed', error);
  //         this.isUploading = false;
  //       }
  //     );
  //   }
  // }
  
  

  fetchEmployeeDetails(): void {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.username = sessionStorage.getItem('username');

    this.http.getEmployeeDetails(this.empId).subscribe(
      (employee) => {
        this.employeeDetails = employee;

        // Call function to calculate current working days
        this.calculateCurrentWorkingDays();

        // Check if current working days crossed 180 and credit leaves
        if (this.currentWorkingDays > 180) {
          this.creditLeaves(6); // Credit 6 leaves
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }

  calculateCurrentWorkingDays(): void {
    const joiningDate = this.employeeDetails.employee.joiningDate;
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in yyyy-mm-dd format
    this.currentWorkingDays = this.calculateWorkingDays(joiningDate, currentDate);
  }

  calculateWorkingDays(joiningDate: string, currentDate: string): number {
    const joinDate = new Date(joiningDate);
    const endDate = new Date(currentDate);

    // Calculate time difference in milliseconds
    const timeDifference = endDate.getTime() - joinDate.getTime();

    // Convert milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Calculate number of weekend days
    const weekends = this.countWeekendDays(joinDate, endDate);

    // Subtract weekends and holidays from total days to get working days
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
