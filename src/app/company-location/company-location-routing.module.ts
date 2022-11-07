import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanylocationComponent } from './company-location.component';

const routes:Routes = [
    {path:'', component:CompanylocationComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  