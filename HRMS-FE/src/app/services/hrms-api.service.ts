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
  accessToken: any;
  constructor(private http: HttpClient) {}

  login(username : string , password : string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/employee/login`, {username, password});
  }

  leaveByUserId(payload:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/leave` , payload);
  }
  getEmployeeDetails(userid: number): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/user/${userid}`);
  }

  getLeaveDetails(userid: number): Observable<LeaveDetails> {
    return this.http.get<LeaveDetails>(`${environment.apiUrl}/leave/${userid}`);
  }
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.apiUrl}/user`);
  }
  markinByUserId(payload:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/attendance`,payload);
  }
  markoutByUserId(userId: number, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/attendance/${userId}`, payload);
  }
  employeebyId(empId:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/employee/${empId}`);
  }
}  
