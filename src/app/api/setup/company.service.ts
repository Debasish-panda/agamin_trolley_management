import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Mapclass } from 'src/app/models/listmap/map';
import { Buildingmap } from 'src/app/models/map/buildingmap';
import { Floormap } from 'src/app/models/map/floormap';
import { AddSection } from 'src/app/models/setup/add-section';
import { Addbuilding } from 'src/app/models/setup/addbuilding';
import { Addfloor } from 'src/app/models/setup/addfloor';
import { Addnew } from 'src/app/models/setup/addnew';
import { BuildingDropdown, BuildingType, FloorDropdown, FloorList, LocationName, LocationType, PostLocationType, SectionList } from 'src/app/types/locationtype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public _serviceUrl: string;
  constructor(private _http: HttpClient) {
    this._serviceUrl = environment.serviceUrl;
  }


  getCompanyLocationTable(pageNum: number, pageSize: number): Observable<LocationType> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let locationparams = new HttpParams();
    if (pageNum)
      locationparams = locationparams.append('PageNumber', pageNum);
    if (pageSize)
      locationparams = locationparams.append('PageSize', pageSize);
    return this._http.get<LocationType>(`${this._serviceUrl}Location`, { headers: header, params: locationparams }).pipe((retry(1)), catchError(this.handleError))
  }

  postCompanyLocationinput(location: Addnew): Observable<Addnew> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.post<Addnew>(`${this._serviceUrl}Location`, location, options).pipe((retry(1)), catchError(this.handleError))
  }

  getCompanyLocationRow(id: number): Observable<Addnew> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<Addnew>(`${this._serviceUrl}Location/${id}`, options).pipe((retry(1)), catchError(this.handleError))

  }

  putCompanyLocationRow(updaterow:Addnew):Observable<Addnew>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.put<Addnew>(`${this._serviceUrl}Location`,updaterow, options).pipe((retry(1)), catchError(this.handleError))
  }

  getCompanyBuildingRow(id: number): Observable<Addbuilding> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<Addbuilding>(`${this._serviceUrl}Building/${id}`, options).pipe((retry(1)), catchError(this.handleError))
  }

  putCompanyBuildingRow(updaterow:Addbuilding):Observable<Addbuilding>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.put<Addbuilding>(`${this._serviceUrl}Building`,updaterow, options).pipe((retry(1)), catchError(this.handleError))
  }

  getCompanyFloorRow(id:number):Observable<Addfloor>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<Addfloor>(`${this._serviceUrl}Floor/${id}`, options).pipe((retry(1)), catchError(this.handleError))
  }

  putCompanyFloorRow(updaterow:Addfloor):Observable<Addfloor>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.put<Addfloor>(`${this._serviceUrl}Floor`,updaterow, options).pipe((retry(1)), catchError(this.handleError))
  }

  getCompanyLocationDropdown() {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<Addnew>(`${this._serviceUrl}LocationDropDown`, options).pipe((retry(1)), catchError(this.handleError))
  }

  deleteCompanyLocation(Id: number) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    return this._http.delete(`${this._serviceUrl}Location/${Id}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  getnameparameterofLocation(locationId: number, pageNum: number, pageSize: number): Observable<LocationName> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let locationparams = new HttpParams();
    if (pageNum)
      locationparams = locationparams.append('PageNumber', pageNum);
    if (pageSize)
      locationparams = locationparams.append('PageSize', pageSize);
    return this._http.get<LocationName>(`${this._serviceUrl}Location/${locationId}`, { headers: header, params: locationparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getnameparameterofBuilding(pageNum: number, pageSize: number): Observable<LocationName> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let locationparams = new HttpParams();
    if (pageNum)
      locationparams = locationparams.append('PageNumber', pageNum);
    if (pageSize)
      locationparams = locationparams.append('PageSize', pageSize);
    return this._http.get<LocationName>(`${this._serviceUrl}Location`, { headers: header, params: locationparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getnameparameterofFloor(locationId: number, pageNum: number, pageSize: number): Observable<LocationName> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let locationparams = new HttpParams();
    if (pageNum)
      locationparams = locationparams.append('PageNumber', pageNum);
    if (pageSize)
      locationparams = locationparams.append('PageSize', pageSize);
    return this._http.get<LocationName>(`${this._serviceUrl}Location/${locationId}`, { headers: header, params: locationparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getBuildingList(locationid: number, pageNumber: number, pageSize: number): Observable<BuildingType> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let buildingparams = new HttpParams();
      buildingparams = buildingparams.append('PageNumber', pageNumber);
      buildingparams = buildingparams.append('PageSize', pageSize);
    return this._http.get<BuildingType>(`${this._serviceUrl}Building/List/${locationid}`, { headers: header, params: buildingparams }).pipe((retry(1)), catchError(this.handleError))
  }
  getbuildingpagination(pageNumber:number, pageSize:number):Observable<BuildingType>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let buildingparams = new HttpParams();
      buildingparams = buildingparams.append('PageNumber', pageNumber);
      buildingparams = buildingparams.append('PageSize', pageSize);
    return this._http.get<BuildingType>(`${this._serviceUrl}Building/List`, { headers: header, params: buildingparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getBuildingDropdown(id: number): Observable<BuildingDropdown> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<BuildingDropdown>(`${this._serviceUrl}BuildingDropDown/${id}`, options).pipe((retry(1)), catchError(this.handleError))
  }

  getFloorDropdown(id: number): Observable<FloorDropdown> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<FloorDropdown>(`${this._serviceUrl}FloorDropDown/${id}`, options).pipe((retry(1)), catchError(this.handleError))
  }

  postBuildingInput(building: Addbuilding): Observable<Addbuilding> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    debugger;
    return this._http.post<Addbuilding>(`${this._serviceUrl}Building`, building, options).pipe((retry(1)), catchError(this.handleError))
  }

  postFloorInput(floor: Addfloor): Observable<Addfloor> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.post<Addfloor>(`${this._serviceUrl}Floor`, floor, options).pipe((retry(1)), catchError(this.handleError))
  }

  getFloorList(buildingid: number, pageNumber: number, pageSize: number): Observable<FloorList> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let floorparams = new HttpParams();
    if (pageNumber)
      floorparams = floorparams.append('PageNumber', pageNumber);
    if (pageSize)
      floorparams = floorparams.append('PageSize', pageSize);
    return this._http.get<FloorList>(`${this._serviceUrl}Floor/List/${buildingid}`, { headers: header, params: floorparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getfloorpagination(pageNumber:number, pageSize:number):Observable<FloorList>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let floorparams = new HttpParams();
      floorparams = floorparams.append('PageNumber', pageNumber);
      floorparams = floorparams.append('PageSize', pageSize);
    return this._http.get<FloorList>(`${this._serviceUrl}Floor/List`, { headers: header, params: floorparams }).pipe((retry(1)), catchError(this.handleError))
  }

  postSectionInput(section: AddSection): Observable<AddSection> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.post<AddSection>(`${this._serviceUrl}Section`, section, options).pipe((retry(1)), catchError(this.handleError))
  }

  getSectionList(floorid: number, pageNumber: number, pageSize: number): Observable<SectionList> {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let sectionparams = new HttpParams();
    if (pageNumber)
    sectionparams = sectionparams.append('PageNumber', pageNumber);
    if (pageSize)
    sectionparams = sectionparams.append('PageSize', pageSize);
    return this._http.get<SectionList>(`${this._serviceUrl}Section/List/${floorid}`, { headers: header, params: sectionparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getsectionpagination(pageNumber:number, pageSize:number):Observable<SectionList>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let sectionparams = new HttpParams();
      sectionparams = sectionparams.append('PageNumber', pageNumber);
      sectionparams = sectionparams.append('PageSize', pageSize);
    return this._http.get<SectionList>(`${this._serviceUrl}Section/List`, { headers: header, params: sectionparams }).pipe((retry(1)), catchError(this.handleError))
  }

  getCompanySectionRow(id:number):Observable<AddSection>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.get<AddSection>(`${this._serviceUrl}Section/${id}`, options).pipe((retry(1)), catchError(this.handleError))
  }

  putCompanySectionRow(updaterow:AddSection):Observable<AddSection>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header }
    return this._http.put<AddSection>(`${this._serviceUrl}Section`,updaterow, options).pipe((retry(1)), catchError(this.handleError))
  }

  deleteCompanyBuilding(Id: number) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    return this._http.delete(`${this._serviceUrl}Building/${Id}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  deleteCompanyFloor(Id: number) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    return this._http.delete(`${this._serviceUrl}Floor/${Id}`, options).pipe((retry(1)), catchError(this.handleError));
  }
  deleteCompanySection(Id: number) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let options = { headers: header };
    return this._http.delete(`${this._serviceUrl}Section/${Id}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  postbuildingimageapi(buildingId: number, file: File) {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    const formData: FormData = new FormData();
    formData.append('file', file)
    return this._http.post<Addbuilding[]>(`${this._serviceUrl}BuildingImage?buildingId=${buildingId}`, formData, options).pipe((retry(1)), catchError(this.handleError));
  }

  postfloorimageapi(floorId:number, file:File){
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const options = { headers: header }
    const formData: FormData = new FormData();
    formData.append('file', file)
    return this._http.post<Addfloor[]>(`${this._serviceUrl}FloorImage?floorId=${floorId}`, formData, options).pipe((retry(1)), catchError(this.handleError));
  }

  getFloorimage(floorId:number):Observable<any>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._http.get(`${this._serviceUrl}FloorImage/${floorId}`, {responseType : 'blob',headers: header}).pipe((retry(1)), catchError(this.handleError));
  
  }
  getBuildingimage(buildingId:number):Observable<any>{
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    const header = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this._http.get(`${this._serviceUrl}BuildingImage/${buildingId}`, {responseType : 'blob',headers: header}).pipe((retry(1)), catchError(this.handleError));
  }

  getLocationListMap():Observable<Mapclass>{
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header}
    return this._http.get<Mapclass>(`${this._serviceUrl}Location/List/Map`, options).pipe((retry(1)), catchError(this.handleError));
  }

  getBuildingListmap(locationid:number):Observable<Buildingmap>{
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header}
    return this._http.get<Buildingmap>(`${this._serviceUrl}Building/List/Map/${locationid}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  getFloorMap(buildingId:number):Observable<any>{
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header}
    return this._http.get(`${this._serviceUrl}FloorMap/${buildingId}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  getTrolleysByFloor(locationId:number, buildingId:number, floorId:number, PageNumber:number, PageSize:number):Observable<Floormap>{
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    let floorparams = new HttpParams();
    floorparams = floorparams.append('locationId', locationId);
    floorparams = floorparams.append('buildingId',buildingId );
    floorparams = floorparams.append('floorId',floorId );
    floorparams = floorparams.append('PageNumber', PageNumber);
    floorparams = floorparams.append('PageSize', PageSize);
    return this._http.get<Floormap>(`${this._serviceUrl}TrolleyMapping/GetTrolleysByFloor`, {headers:header, params:floorparams}).pipe((retry(1)), catchError(this.handleError));
  }
  getSectionMap(floorId:number):Observable<any>{
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    const options = {headers:header}
    return this._http.get(`${this._serviceUrl}SectionMap/${floorId}`, options).pipe((retry(1)), catchError(this.handleError));
  }

  getTrolleysBySection(locationId:number, buildingId:number, floorId:number, sectionId:number, PageNumber:number, PageSize:number){
    const token = JSON.parse(localStorage.getItem('currentUser')|| '{}').token;
    const header = new HttpHeaders({Authorization: `Bearer ${token}`});
    let floorparams = new HttpParams();
    floorparams = floorparams.append('locationId', locationId);
    floorparams = floorparams.append('buildingId',buildingId );
    floorparams = floorparams.append('floorId',floorId );
    floorparams = floorparams.append('sectionId',sectionId );
    floorparams = floorparams.append('PageNumber', PageNumber);
    floorparams = floorparams.append('PageSize', PageSize);
    return this._http.get<Floormap>(`${this._serviceUrl}TrolleyMapping/GetTrolleysBySection`, {headers:header, params:floorparams}).pipe((retry(1)), catchError(this.handleError));
  }





  handleError(error: { error: { message: any }; status: any }) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`
    }
    else {
      errorMessage = `${error.status}`
    }
    return throwError(errorMessage);
  }



}
