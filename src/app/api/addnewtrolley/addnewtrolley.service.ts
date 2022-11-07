import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, map } from 'rxjs';
import { Addnewtrolley, AddnewtrolleyResponse, GetQrCodeResponse } from 'src/app/models/addnewtrolley/addnewtrolley';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddnewtrolleyService {

  public _serviceUrl: string;
  constructor(private http: HttpClient) {
    this._serviceUrl = environment.serviceUrl;
  }

  postaddnewTrolleyapi(data: Addnewtrolley): Observable<AddnewtrolleyResponse> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    debugger;
    return this.http.post<AddnewtrolleyResponse>(`${this._serviceUrl}Trolley`, data, options).pipe(((retry(1)), catchError(this.handleError)));
  }

  postimageapi(id: number, file: File) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    const formData: FormData = new FormData();
    formData.append('file', file)
    return this.http.post<Addnewtrolley[]>(`${this._serviceUrl}TrolleyPhoto?id=${id}`, formData, options).pipe((retry(1)), catchError(this.handleError));
  }

  getQrCode(id: number): Observable<GetQrCodeResponse> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    return this.http.get<GetQrCodeResponse>(`${this._serviceUrl}Trolley/GetTrolley?id=${id}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  postTrolleyQrCode(qrCode: string) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    debugger;
    return this.http.post<Addnewtrolley[]>(`${this._serviceUrl}TrolleyQRCode?qrCode=${qrCode}`, qrCode, options).pipe((retry(1), catchError(this.handleError)));
  }

  getGenerateQeCodeImage(qrNo:string){
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    return this.http.get<Addnewtrolley[]>(`${this._serviceUrl}TrolleyQRCode/GenerateQrcodeImage?qrNo=${qrNo}`, options).pipe((retry(1), catchError(this.handleError)));
  
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
