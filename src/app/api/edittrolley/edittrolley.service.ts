import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Edittrolley, QrCode } from 'src/app/models/edittrolley/edittrolley';
import { Qrcode } from 'src/app/types/listoftrolleytype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EdittrolleyService {

  public _serviceUrl: string = "";
  constructor(private http: HttpClient) {
    this._serviceUrl = environment.serviceUrl;
  }

  gettrolleybyidapi(id: number): Observable<Edittrolley> {
    debugger;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this.http.get<Edittrolley>(`${this._serviceUrl}Trolley/GetTrolley?Id=${id}`, options).pipe((retry(1), catchError(this.handleError)));
  }

  getQRImageDetailsById(trolleyId:number):Observable<Qrcode>{
    debugger;
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = {headers:header};
    return this.http.get<Qrcode>(`${this._serviceUrl}TrolleyQRCode/GetQRImageDetailsById?trolleyId=${trolleyId}`, options).pipe((retry(1), catchError(this.handleError)));
 
  }

  putedittrolleyapi(update: Edittrolley): Observable<Edittrolley[]> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` })
    // let options = { headers: header }
    debugger;
    return this.http.put<Edittrolley[]>(`${this._serviceUrl}Trolley/EditTrolley`, update, { headers: header }).pipe((retry(1), catchError(this.handleError)));
  }

  handleError(error: { error: { message: any }; status: any }) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`
    } else {
      errorMessage = `${error.status}`
    }
    return throwError(errorMessage);
  }
}
