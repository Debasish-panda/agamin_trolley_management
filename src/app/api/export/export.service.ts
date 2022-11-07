import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Export } from 'src/app/models/export/export';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  public _serviceUrl = "";
  constructor(
    private _http: HttpClient
  ) {
    this._serviceUrl = environment.serviceUrl;
  }

  getTrolleyExportapi(trolleyModel: string, area: string, typeOfParts: string): Observable<Export[]> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let exportparams = new HttpParams();
    exportparams = exportparams.append('TrolleyModel', trolleyModel)
    exportparams = exportparams.append('Area', area)
    exportparams = exportparams.append('TypeOfParts', typeOfParts)
    return this._http.get<Export[]>(`${this._serviceUrl}TrolleyTracking/Export`, { headers: header, params: exportparams }).pipe((retry(1)), catchError(this.handleError))
  }
  handleError(error: { error: { message: any }; status: any }) {
    let errorMessage = "";
    if (error.error instanceof Error) {
      errorMessage = `${error.error.message}`
    }
    else {
      errorMessage = `${error.status}`
    }
    return throwError(errorMessage);
  }

}


