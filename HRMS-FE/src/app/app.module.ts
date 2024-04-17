import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
// import { MarkInComponent } from './components/in-out/mark-in/mark-in/mark-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MarkInComponent } from './components/daily-attendance/mark-in/mark-in.component';
import { MarkOutComponent } from './components/daily-attendance/mark-out/mark-out.component';
import { HomeComponent } from './components/home/home.component';
import { LeaveComponent } from './components/leave/leave.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ListOfEmployeesComponent } from './components/admin/list-of-employees/list-of-employees.component';
import { EmployeeDetailsComponent } from './components/admin/employee-details/employee-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ListOfAttendanceComponent } from './components/admin/list-of-attendance/list-of-attendance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LeavesForEmployeeComponent } from './components/leaves-for-employee/leaves-for-employee.component';
import { RegisterEmployeeComponent } from './components/admin/register-employee/register-employee.component';
import { ForgotMarkinComponent } from './components/daily-attendance/forgot-markin/forgot-markin.component';
import { ForgotToMarkoutComponent } from './components/daily-attendance/forgot-to-markout/forgot-to-markout.component';
import { EmpDetailsComponent } from './components/emp-details/emp-details.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    MarkInComponent,
    MarkOutComponent,
    HomeComponent,
    LeaveComponent,
    MyProfileComponent,
    PayslipComponent,
    AttendanceComponent,
    ListOfEmployeesComponent,
    EmployeeDetailsComponent,
    ListOfAttendanceComponent,
    
    LeavesForEmployeeComponent,
      RegisterEmployeeComponent,
      ForgotMarkinComponent,
      ForgotToMarkoutComponent,
      EmpDetailsComponent,


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(), 
    TimepickerModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
