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


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(), 
    TimepickerModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
