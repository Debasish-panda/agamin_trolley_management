import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeScale } from 'chart.js';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Listoftrolleytype } from 'src/app/types/listoftrolleytype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListoftrolleyService {


  public _serviceUrl: string;
  constructor(private http: HttpClient) {
    this._serviceUrl = environment.serviceUrl;
  }

  getlistoftrolleyapi(query:string, pagenumber: number, pagesize: number): Observable<Listoftrolleytype> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` })
    let querysearchandpagination = new HttpParams();
    querysearchandpagination = querysearchandpagination.append('Query', query);
    if (pagenumber)
      querysearchandpagination = querysearchandpagination.append('PageNumber', pagenumber);
    if (pagesize)
      querysearchandpagination = querysearchandpagination.append('PageSize', pagesize);
    return this.http.get<Listoftrolleytype>(`${this._serviceUrl}TrolleyDashboardDetails`, {headers:header, params:querysearchandpagination}).pipe(retry(1), catchError(this.handleError))
  }


  getPrintCheckedQRImage(ids:Array<any>){
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    // let options = {headers:header}

    let arrayvalue= new HttpParams();
     for(let i=0; i<ids.length; i++){
      arrayvalue = arrayvalue.append('ids', ids[i])
     }
    debugger;
    return this.http.get(`${this._serviceUrl}TrolleyQRCode/PrintCheckedQRImage`,{headers:header, params:arrayvalue}).pipe(retry(1), catchError(this.handleError));  
  }


  getsearchapi(query: string): Observable<Listoftrolleytype> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let querysearchandpagination = new HttpParams();
    if (query)
      querysearchandpagination = querysearchandpagination.append('Query', query);
    return this.http.get<Listoftrolleytype>(`${this._serviceUrl}TrolleyTracking`, { headers: header, params: querysearchandpagination }).pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: { error: { message: any }; status: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`
    } else {
      errorMessage = `${error.status}`
    }
    return throwError(errorMessage);
  }

}
