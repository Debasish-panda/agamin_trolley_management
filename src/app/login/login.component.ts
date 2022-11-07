import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../api/login/login.service';
import { Login } from '../types/login';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  login: Login = new Login();
  loginForm: any;
  formvalue: any;
  items:any;

  getErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value';
    }
    return this.username.hasError('username') ? 'Not a valid Username' : '';
  }

  constructor(private _loginservice: LoginService,
    private formbuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    })
  }

  onSubmit(form: FormGroup) {

  }
  loginbyclick() {
    // if (this.login.username && this.login.password) {
    //   this._loginservice.loginservice(this.login).subscribe(res => {
    //     this.router.navigate(['dashboard'])
    //   }
    //   )
    if (!(this.login.username && this.login.password)) {
      this.openSnackBar('Enter username and password')
    } else {
      let scopeThis=this;
      this._loginservice.loginservice(this.login).subscribe({
        next(data) {
          if (data) {
            scopeThis.items = data;
            localStorage.setItem('currentUser', JSON.stringify(data));
            let userRole = JSON.parse(localStorage.getItem('currentUser') || '{}').roles;
            if (scopeThis.items.id == 1 || userRole == 'Admin') {
              scopeThis.router.navigate(['dashboard']);
            }
            else {
              scopeThis.openSnackBar('Access denied to user for this process');
              scopeThis.router.navigate(['/login']);
            }            
          }
        },
        error(msg) {
          console.log('login with credential')
          if (msg === '401') {
            scopeThis.router.navigate(['/login']);
            scopeThis.openSnackBar('Session Timeout');
          } else if (msg === '400') {
            scopeThis.openSnackBar('Enter Valid Credentials');
          }
        }
      });
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
    });
  }



}
