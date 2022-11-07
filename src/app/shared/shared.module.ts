import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgxSpinnerModule } from "ngx-spinner";



@NgModule({
  declarations: [
    SpinnerComponent
  ],
  exports:[SpinnerComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
