import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MarkInComponent } from './components/daily-attendance/mark-in/mark-in.component';
import { MarkOutComponent } from './components/daily-attendance/mark-out/mark-out.component';
import { HomeComponent } from './components/home/home.component';
import { LeaveComponent } from './leave/leave.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';



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

    path: 'leave',
    component: LeaveComponent,
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
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
