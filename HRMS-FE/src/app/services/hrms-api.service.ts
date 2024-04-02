import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrmsApiService {

  constructor(private http: HttpClient) {}

  getEmployee():Observable<any>{
    return this.http.get(`${environment.apiUrl}user`)
  }







}
