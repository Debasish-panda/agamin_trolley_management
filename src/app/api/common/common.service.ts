import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  openSnackbar(message: string) {
    this.snackbar.open(message, "", { duration: 2000 })
  }
  listoftrolleytable: boolean = true;
}
