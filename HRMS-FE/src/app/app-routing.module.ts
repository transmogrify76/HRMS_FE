import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MarkInComponent } from './components/daily-attendance/mark-in/mark-in.component';
import { MarkOutComponent } from './components/daily-attendance/mark-out/mark-out.component';
import { HomeComponent } from './components/home/home.component';
import { LeaveComponent } from './components/leave/leave.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { PayslipComponent } from './components/payslip/payslip.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { EmployeeDetailsComponent } from './components/admin/employee-details/employee-details.component';
import { ListOfAttendanceComponent } from './components/admin/list-of-attendance/list-of-attendance.component';
import { LeavesForEmployeeComponent } from './components/leaves-for-employee/leaves-for-employee.component';
import { RegisterEmployeeComponent } from './components/admin/register-employee/register-employee.component';
import { ForgotMarkinComponent } from './components/daily-attendance/forgot-markin/forgot-markin.component';
import { ForgotToMarkoutComponent } from './components/daily-attendance/forgot-to-markout/forgot-to-markout.component';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'mark-in',
    component: MarkInComponent,
  },
  {
    path: 'mark-out',
    component: MarkOutComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {

    path: 'attendance',
    component: AttendanceComponent,
  },

  {

    path: 'leave',
    component: LeaveComponent,
  },
  {

    path: 'payslip',
    component: PayslipComponent,
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
  },
  {

    path: 'empdetails',
    component: EmployeeDetailsComponent,
  },
  
  {
    path:'list-of-attendance',
    component:ListOfAttendanceComponent
   }  ,
   {
    path:'register-employee',
    component: RegisterEmployeeComponent
   }  ,
   {
    path:'forgot-markin',
    component: ForgotMarkinComponent
   }  ,
   {
    path:'forgot-markout',
    component:ForgotToMarkoutComponent
   }  ,
  {

    path: 'personalleave',
    component: LeavesForEmployeeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
            FormsModule,
            BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { 
 
}
