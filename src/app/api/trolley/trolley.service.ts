import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { local } from 'd3';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { TrolleyArea, Trolleymovement } from 'src/app/types/trolleymovement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrolleyService {

  public serviceUrl: string;

  constructor(private _httpclient: HttpClient) {
    this.serviceUrl = environment.serviceUrl;

  }

  gettrolleylist(searchQuery:string, pagenumber: number, pagesize: number): Observable<Trolleymovement> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let querysearchandpagination = new HttpParams();
    querysearchandpagination = querysearchandpagination.append('Query', searchQuery);
    if (pagenumber)
      querysearchandpagination = querysearchandpagination.append('PageNumber', pagenumber);
    if (pagesize)
      querysearchandpagination = querysearchandpagination.append('PageSize', pagesize);
    return this._httpclient.get<Trolleymovement>(`${this.serviceUrl}TrolleyTracking`, { headers: header, params: querysearchandpagination }).pipe(retry(1), catchError(this.handleError));
  }

  getsearchtrolleylist(query: string, area: string): Observable<Trolleymovement> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let querysearchandpagination = new HttpParams();
    if (query)
      querysearchandpagination = querysearchandpagination.append('Query', query);
    if (area)
      querysearchandpagination = querysearchandpagination.append('Area', area);
    return this._httpclient.get<Trolleymovement>(`${this.serviceUrl}TrolleyTracking`, { headers: header, params: querysearchandpagination }).pipe(retry(1), catchError(this.handleError));
  }

  gettrolleyarea(): Observable<TrolleyArea> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    return this._httpclient.get<TrolleyArea>(`${this.serviceUrl}Area`, options).pipe((retry(1)), catchError(this.handleError));

  }


  gettrolleyReports(trolleyModel: string, area: string, typeOfParts: string, pagenumber: number, pagesize: number): Observable<Trolleymovement> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let querysearchandpagination = new HttpParams();
    if (trolleyModel)
      querysearchandpagination = querysearchandpagination.append('TrolleyModel', trolleyModel)
    if (area)
      querysearchandpagination = querysearchandpagination.append('Area', area)
    if (typeOfParts)
      querysearchandpagination = querysearchandpagination.append('TypeOfParts', typeOfParts)
    if (pagenumber)
      querysearchandpagination = querysearchandpagination.append('PageNumber', pagenumber)
    if (pagesize)
      querysearchandpagination = querysearchandpagination.append('PageSize', pagesize)

    return this._httpclient.get<Trolleymovement>(`${this.serviceUrl}TrolleyTracking/Reports`, { headers: header, params: querysearchandpagination }).pipe((retry(1)), catchError(this.handleError));
  }

  getTrolleyTypeofParts(){
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header};
    return this._httpclient.get(`${this.serviceUrl}TypeOfParts`, options).pipe((retry(1)), catchError(this.handleError));
  }
  getTrolleyModel(){
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header};
    return this._httpclient.get(`${this.serviceUrl}TrolleyModel`, options).pipe((retry(1)), catchError(this.handleError));
  }

  handleError(error: { error: { message: any }; status: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      errorMessage = `${error.status}`;
    }
    return throwError(errorMessage);
  }

}
