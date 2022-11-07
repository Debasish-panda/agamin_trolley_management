import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private snackbar:MatSnackBar,
    private router:Router
  ) { }

  openSnackbar(message: string) {
    this.snackbar.open(message, "", { duration: 2000 })
  }
 
}
