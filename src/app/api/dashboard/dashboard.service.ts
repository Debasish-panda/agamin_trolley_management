import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Dashboardtype } from 'src/app/types/dashboardtype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public _serviceUrl:string
  constructor(private _http: HttpClient) {
    this._serviceUrl=environment.serviceUrl
   }

  dashboardapi(): Observable<Dashboardtype> {
    //  debugger;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = { headers: header }
    return this._http.get<Dashboardtype>(`${this._serviceUrl}DashboardData`,options).pipe(retry(1), catchError(this.handleError));
  }
  handleError(error: { error: { message: any; }; status: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      errorMessage = `${error.status}`;
    }
    return throwError(errorMessage);
  }

}
