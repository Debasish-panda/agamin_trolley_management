import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewTrolleyComponent } from './add-new-trolley/add-new-trolley.component';
import { AddtrolleyComponent } from './addtrolley/addtrolley.component';
import { CompanylocationComponent } from './company-location/company-location.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditrowComponent } from './editrow/editrow.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ReportsComponent } from './reports/reports.component';
import { TrolleysComponent } from './trolleys/trolleys.component';


const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {

    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard-content', pathMatch: 'full' },
      { path: 'dashboard-content', component: DashboardContentComponent },
      { path: 'trolleys', component: TrolleysComponent },
      {
        path: 'addtrolley', component: AddtrolleyComponent,
        // children: [
        //   { path: 'addnewtrolley', component: AddNewTrolleyComponent }
        // ]
      },
      { path: 'addnewtrolley', component: AddNewTrolleyComponent },
      { path: 'company-location', component:CompanylocationComponent},
      { path: 'map', component: MapComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'editrow/:id', component: EditrowComponent }
    ]
  },
  { path: '**', component: LoginComponent }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
