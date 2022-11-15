
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CommonService } from '../api/common/common.service';
// import * as Chart from 'chart.js';
import { DashboardService } from '../api/dashboard/dashboard.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {

  holddashboardvalue: any;

  constructor(private _dashboardapi: DashboardService,
    private router: Router,
    private common: CommonService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.fetchdashboardcontentapi();
  }
  display_RequestCards = "visible";
  toggleToTable() {

    this.display_RequestCards = "hidden";
  }
  backToChart() {
    this.display_RequestCards = "visible";
  }
  barchart() {
    // console.log(this.holddashboardvalue.totalTrolley);
    const label:any = ['Total Trolly', 'To Be Filled', 'To Be Shipped', 'To Be Received', 'Out Of Trace'];
    const barChart = new Chart('barChart', {
      type: 'bar',
     
      data: {
        labels:label,
        datasets: [{
          data: [this.holddashboardvalue?.totalTrolley, this.holddashboardvalue?.trolleyToBeFilled, this.holddashboardvalue?.trolleyToBeShipped, this.holddashboardvalue?.trolleyTobeReceived, this.holddashboardvalue?.trolleyOutOfTrace],
          // data: [200, 33, 333, 29, 22],
          backgroundColor: [
            'rgb(255, 221, 153)',
            'rgb(170, 225, 252)',
            'rgb(144, 171, 252)',
            'rgb(230, 151, 250)',
            'rgb(251, 137, 175)'
          ],
          hoverBackgroundColor: [
            'rgb(255, 221, 153)',
            'rgb(170, 225, 252)',
            'rgb(144, 171, 252)',
            'rgb(230, 151, 250)',
            'rgb(251, 137, 175)'
          ],
          borderColor: [
            'rgb(255, 221, 153)',
            'rgb(170, 225, 252)',
            'rgb(144, 171, 252)',
            'rgb(230, 151, 250)',
            'rgb(251, 137, 175)'
          ],
        
          borderWidth: 1,
          barPercentage: 0.35
        }]
      },
      options: {
        plugins: {
          legend: {
            display:false,
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            display:true,
            title: {
              display: true,
              text: 'Trolley Count'
            }
          },
          x: {
            display: true,
            grid: {
              display: false
           }
           
          }
        },

      }
    });
  }

  piechart() {
    const pieChart = new Chart("pieChart", {
      type: 'pie',
      data: {
        labels: [
          'Total Active Trolley',
          'Total Inactive Trolley'
        ],
        datasets: [{
          data: [this.holddashboardvalue?.totalTrolley, this.holddashboardvalue?.trolleyInactive],
          // data: [40, 60],
          backgroundColor: [
            'rgb(0, 179, 107)',
            'rgba(239,98,98,255)'
          ],
          hoverBackgroundColor: [
            'rgb(0, 179, 107)', 'rgba(239,98,98,255)'
          ],
          hoverOffset: 2
        }]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 1
          }
        },
        responsive:true,
        plugins:{
          legend:{
            position:'top'
          }
        }

      }

    });
  }


  fetchdashboardcontentapi() {
    let scopThis = this;
    this._dashboardapi.dashboardapi().subscribe({
      next(data) {
        // debugger;
        scopThis.spinner.show();
        scopThis.holddashboardvalue = data;
        scopThis.spinner.hide();
        // console.log(scopThis.holddashboardvalue);
        scopThis.barchart();
        scopThis.piechart();
      }, error(msg) {
        if (msg == '401') {
          scopThis.common.openSnackbar('Session Expired Re-Login again')
          scopThis.router.navigate(['login']);
        }
      }
    })
    // debugger;
    // console.log(this.holddashboardvalue);
  }

  // fetchdashboardcontentapi() {
  //   this._dashboardapi.dashboardapi().subscribe(res => {
  //     this.holddashboardvalue = res
  //     console.log(res);
  //   })
  // }


  // openSnackBar(message: string) {
  //   this._snackbar.open(message, "", {
  //     duration: 2000,
  //   });
  // }
}
