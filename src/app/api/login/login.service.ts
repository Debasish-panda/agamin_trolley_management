import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Login } from "src/app/types/login"
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {


  public _baseUrl:string;
  public _serviceUrl:string;
  constructor(private http: HttpClient) { 
    this._baseUrl=environment.baseUrl;
    this._serviceUrl=environment.serviceUrl;
  }


  loginservice(login: Login): Observable<Login> {
    
    const header = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    const options = { headers: header };
    console.log(options.headers.get);
    return this.http.post<Login>(`${this._baseUrl}Authenticate`, login, options).pipe(retry(1), catchError(this.handleError));
  }
  
  logoutapi() {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = { headers: header };
    return this.http.delete(`${this._serviceUrl}Logout`, options).pipe(retry(1), catchError(this.handleError))
    
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
