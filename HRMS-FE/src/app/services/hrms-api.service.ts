import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environments';
import { Observable } from 'rxjs';
// import { Employee } from '../components/admin/employee-details/employee-details.component';


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
  getEmployeeDetails(userid: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/employee/${userid}`);
  }

  getLeaveDetails(empId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/leave?empId=${empId}`);
  }
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/user`);
  }
  markinByUserId(payload:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/attendance`,payload);
  }
  markoutByUserId(userId: number, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/attendance/${userId}`, payload);
  }

  getEmployees(): Observable<any> {
    this.accessToken = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
    return this.http.get<any>(`${environment.apiUrl}/employee` , {headers: headers});
  }
  employeebyId(empId:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/employee/${empId}`);
  }

  updateLeaveStatus(leaveId: number, empId:number,payload: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/leave/${empId}/${leaveId}`, payload);
  }
  getattendance(empId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/attendance?empId=${empId}`);
  }
  register(data:any):Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/employee/register` , data);
  }
  empdetails( payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employeedetails`, payload);
  }
}  
