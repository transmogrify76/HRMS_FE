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
  getAllActiveEmployees(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/employee/active`);
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
  payrollDetails( payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payroll`, payload);
  }
  updatePayroll(empId: number , payload: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/payroll/${empId} `, payload);
  }
  allAttendancebyMonthAndYear(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/attendance/${year}/${month}`);
  }
  
  Payrolldetails(payload: any):Observable<any> {
    return this.http.post(`${environment.apiUrl}/payrolldetails`, payload);
  }
  allLeavebyMonth(month:number):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/leave/${month} `)
  }
  employeeDetailsUpdate(empId: number , payload: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/employee/${empId} `, payload);
  }
  
  deactivateUser(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employee/deactivate`, payload);
  }

  uploadProfilePic(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${environment.apiUrl}/images/upload`, formData);
  }

  getProfilePicture(imageId : number) : Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/images/${imageId}` , { responseType: 'blob' });
  }
}  
