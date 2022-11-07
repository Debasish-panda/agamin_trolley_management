import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { NgChartsModule } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { TrolleysComponent } from './trolleys/trolleys.component'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddtrolleyComponent } from './addtrolley/addtrolley.component';
import { AddNewTrolleyComponent } from './add-new-trolley/add-new-trolley.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MapComponent } from './map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CompanyLocationModule } from './company-location/company-location.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReportsComponent } from './reports/reports.component';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { EditrowComponent } from './editrow/editrow.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PrintQrcodeComponent } from './print-qrcode/print-qrcode.component';
import { NgxPrintElementModule } from 'ngx-print-element';
import { ColorPickerModule } from 'ngx-color-picker';

import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DashboardContentComponent,
    TrolleysComponent,
    AddtrolleyComponent,
    AddNewTrolleyComponent,
    MapComponent,
    LoginComponent,
    ReportsComponent,
    EditrowComponent,
    PrintQrcodeComponent,
    // SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatBadgeModule,
    NgChartsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    GoogleMapsModule,
    CompanyLocationModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSortModule,
    MatProgressBarModule,
    MatCheckboxModule,
    NgxPrintElementModule,
    ColorPickerModule,
    SharedModule
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
