import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../api/login/login.service';
import * as $ from "jquery"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayNavbar !: string;
  displaysetupNavbar !: string;
  logout !: string;

  constructor(private router: Router,
    private _logoutservice: LoginService
  ) { }

  ngOnInit(): void {
    this.displayNavbar = '1';

    $(document).ready(function(){
      $(".nav-link").click(function () {
        $(".arrow-icon").toggleClass('arrow-icon-rotate');
      });
    });

    $(document).ready(function(){
      $(".nav-link-last").click(function () {
        $(".arrow-icon-last").toggleClass('arrow-icon-rotate-last');
      });
    });
 

    // $("#menu-toggle").click(function(e) {
    //   e.preventDefault();
    //   $("#wrapper").toggleClass("toggled");
    // });


    $(document).ready(function () {

      $('#sidebarCollapse').click(function (e) {
        e.stopPropagation();
          $('#sidebar').toggleClass('active');
      });
      $('.routerset').click(function(e) {
        if ($('#sidebar').hasClass('active')) {
          $("#sidebar").toggleClass('active')
        }
    });
  });
  }

  toggleelement() {

    if (this.displayNavbar == '0') {
      this.displayNavbar = '1';
    } else {
      this.displayNavbar = '0';
    }
  }
  togglesetup() {
    if (this.displaysetupNavbar == '0') {
      this.displaysetupNavbar = '1';
    } else {
      this.displaysetupNavbar = '0';
    }
  }
  navigate() {
    this._logoutservice.logoutapi().subscribe(res => {
      this.router.navigate(['login']);
      localStorage.removeItem('currentUser');
      localStorage.clear();
    })
  }

  togglelogout() {
    if (this.logout == '0') {
      this.logout = '1';
    } else {
      this.logout = '0';
    }

  }




}
