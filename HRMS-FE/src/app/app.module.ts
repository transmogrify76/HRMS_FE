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
import { LeaveComponent } from './leave/leave.component';


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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(), 
    TimepickerModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
