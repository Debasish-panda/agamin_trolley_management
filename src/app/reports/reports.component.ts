import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TrolleyService } from '../api/trolley/trolley.service';
import { Pagination } from '../models/pagination';
import { Tabletype } from '../types/tabletype';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../api/common/common.service';
import { Router } from '@angular/router';
import { ExportService } from '../api/export/export.service';
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver'
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  trolleymodel: string = "";
  area: string = "";
  typeofparts: string = "";
  pagenumber: number = 1;
  holdReport: any;
  dataSource = new MatTableDataSource<Tabletype>;
  paginationlength: Pagination = new Pagination();
  sortColumn!: string
  holdTrolleyModel: any = [];
  holdArea: any = [];
  holdTypeofParts: any = [];
  @ViewChild('tableToConvert', { static: true }) tableToConvert!: ElementRef;

  trolleyModelVal: any = [];
  trolleyAreaVal: any = ['Production', 'FG', 'Shipping'];
  trolleyTypeofPartsVal: any = [];

  componentName: string = "Trolley_All_Report";
  exporttoTable: any;

  constructor(
    private _trolleyservice: TrolleyService,
    private _common: CommonService,
    private router: Router,
    private _getexportapi: ExportService,
    private spinner: NgxSpinnerService
  ) { }
  change(val: any) {
    console.log(val);
  }

  ngOnInit(): void {

    this.getTrolleyTrackingReport();
    // this.exportonbuttonclick();
    this.Listofmodel();
    this.TypeofParts();
  }
  // displayedColumns: string[] = ['slno', 'image', 'tagid', 'parttype', 'trolleymodel', 'previousarea', 'currentarea', 'dateandtime'];
  displayedColumns: string[] = ['id', 'bleTagId', 'trolleyModel', 'typeOfParts', 'previousArea', 'currentArea', 'arrivalTime'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matsort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  Listofmodel() {
    let scopeThis = this
    this._trolleyservice.getTrolleyModel().subscribe({
      next(data) {
        let modelVal: any = [];
        modelVal = data;
        modelVal.forEach((val) => {
          scopeThis.trolleyModelVal.push(val.name);
          console.log(scopeThis.trolleyModelVal);
        })
      }
    });
  }

  TypeofParts() {
    let scopeThis = this
    this._trolleyservice.getTrolleyTypeofParts().subscribe({
      next(data) {
        let parttype: any = [];
        parttype = data;
        parttype.forEach((val) => {
          scopeThis.trolleyTypeofPartsVal.push(val.name);
          console.log(scopeThis.trolleyAreaVal);
        })
      }
    });
  }

  selectedModelValue: any;
  selectedArealValue: any;
  selectedPartsValue: any;

  gettrolleymodelvalue(val: any) {
    this.selectedModelValue = val
    if(val=="Select Trolley Model"){
      this.selectedModelValue="";
    }
  }

  gettrolleyareavalue(val: any) {
    this.selectedArealValue = val;
    if(val=="Select Trolley Area"){
      this.selectedArealValue="";
    }
  }
  gettrolleytypeofpartsvalue(val: any) {
    this.selectedPartsValue = val;
    if(val=="Select Type of Parts"){
      this.selectedPartsValue="";
    }
  }


  getTrolleyTrackingReport() {
    this.spinner.show();
    let scopeThis = this;
    debugger;
    this._trolleyservice.gettrolleyReports(this.selectedModelValue, this.selectedArealValue, this.selectedPartsValue, this.pagenumber, this.paginationlength.pageSize).subscribe({
      next(data) {
        debugger;
        scopeThis.holdReport = data;
        console.log(scopeThis.holdReport.data);

        scopeThis.dataSource = new MatTableDataSource<Tabletype>(scopeThis.holdReport.data);
        scopeThis.paginationlength.length = scopeThis.holdReport.totalRecords;
        scopeThis.dataSource.sort = scopeThis.matsort;
        scopeThis.spinner.hide();
        if (scopeThis.holdReport.data.length == 0) {
          scopeThis._common.openSnackbar('No data found');
          scopeThis.spinner.hide();
          return;
        }


      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }

      }
    })
  }


  pagechange(ev: any) {
    let scopeThis = this;
    this._trolleyservice.gettrolleyReports(this.trolleymodel, this.area, this.typeofparts, ev.pageIndex + 1, ev.pagesize).subscribe({
      next(data) {
        scopeThis.dataSource = new MatTableDataSource<Tabletype>(scopeThis.holdReport.data);
        scopeThis.paginationlength.length = scopeThis.holdReport.totalRecords;
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }

      }
    })
  }

  exportonbuttonclick() {
    let scopeThis = this;
    debugger;
    this._getexportapi.getTrolleyExportapi(this.trolleymodel, this.area, this.typeofparts).subscribe({
      next(data) {
        console.log(data);
        scopeThis.exporttoTable = data;
        scopeThis.exportToExcel();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }

      }
    })
  }

  exportToExcel() {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    // const element = this.tableToConvert.nativeElement;
    const element = document.getElementById('tableToConvert')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    saveAs.saveAs(new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: EXCEL_TYPE }), this.componentName + EXCEL_EXTENSION);
  }
}

