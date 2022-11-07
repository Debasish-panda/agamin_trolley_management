import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CompanylocationComponent} from './company-location.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';
import { LocationComponent } from './location/location.component';
import { BuildingComponent } from './building/building.component';
import { SectionComponent } from './section/section.component';
import { FloorComponent } from './floor/floor.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CompanylocationComponent,
    LocationComponent,
    BuildingComponent,
    SectionComponent,
    FloorComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    GoogleMapsModule,
    MatButtonModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    SharedModule

  ]
})
export class CompanyLocationModule { }
