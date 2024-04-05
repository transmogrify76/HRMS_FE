import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environments';
import { Observable } from 'rxjs';
import { Employee } from '../components/admin/employee-details/employee-details.component';
import { LeaveDetails } from '../components/admin/employee-details/employee-details.component';


@Injectable({
  providedIn: 'root'
})
export class HrmsApiService {
  getCurrentUserRole: any;
  get: any;

  constructor(private http: HttpClient) {}

  // getUser(): Observable<any> {
  //   return this.http.get<any>(`${environment.apiUrl}/employees/`);
  // } 
  // getUserById(customer_id: number): Observable<any> {
  //   return this.http.get<any>(`${environment.apiUrl}/user/${customer_id}/` );
  // } 
  leaveByUserId(userid:number,payload:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/leave/${userid}` , payload);
  }
  getEmployeeDetails(userid: number): Observable<Employee> {
    return this.http.get<Employee>(`http://localhost:3000/user/${userid}`);
  }

  // Method to fetch leave details for an employee from the API
  getLeaveDetails(userid: number): Observable<LeaveDetails> {
    return this.http.get<LeaveDetails>(`http://localhost:3000/leave/${userid}`);
  }
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('http://localhost:3000/user');
  }

}
