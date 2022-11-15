import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ListoftrolleyService } from '../api/listoftrolley/listoftrolley.service';
import { Listoftrolleytype } from '../types/listoftrolleytype';
import { Pagination } from '../models/pagination';
import { CommonService } from '../api/common/common.service';
import { Router } from '@angular/router';
import { Addnewtrolley } from '../models/addnewtrolley/addnewtrolley';
import { EdittrolleyService } from '../api/edittrolley/edittrolley.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PrintQrcodeComponent } from '../print-qrcode/print-qrcode.component';
import { NgxPrintElementService } from 'ngx-print-element';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-addtrolley',
  templateUrl: './addtrolley.component.html',
  styleUrls: ['./addtrolley.component.css']
})
export class AddtrolleyComponent implements OnInit, AfterViewInit {
  padding = "4px";
  bradius = "50%";
  item: any;
  queryString: string = "";
  pageNumber: number = 1;
  dataSource = new MatTableDataSource<any>;
  paginationlength: Pagination = new Pagination();
  rowId: any;
  requiredid: any;
  columns: any = [];
  displayColumns: any = [];
  imagetodisplay: any;
  position!: number;
  noimage: any;

  updatetrolley: Addnewtrolley = new Addnewtrolley();
  @ViewChild(PrintQrcodeComponent) printqrfile: PrintQrcodeComponent;

  constructor(
    private _listoftrolleyService: ListoftrolleyService,
    private _common: CommonService,
    private router: Router,
    private _edittrolleyrow: EdittrolleyService,
    public print: NgxPrintElementService,
    private spinner: NgxSpinnerService
  ) { }
  public config = {
    printMode: 'template-popup',
    popupProperties: 'toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,fullscreen=yes',
    pageTitle: 'Hello World',
    templateString: '<header>I\'m part of the template header</header>{{printBody}}<footer>I\'m part of the template footer</footer>',
    stylesheets: [{ rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' }],
    styles: ['td { border: 1px solid black; color: green; }', 'table { border: 1px solid black; color: red }', 'header, table, footer { margin: auto; text-align: center; }']
  }

  ngOnInit(): void {
    this.trollytabledisplay();
 
  }
  displayedColumns: string[] = ['select', 'id', 'image', 'trolleyNumber', 'trolleyModel', 'trolleyName', 'partsCapacity', 'department', 'bleTagId', 'qrCode'];
  selection = new SelectionModel<Addnewtrolley>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: Addnewtrolley): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.trolleyNumber + 1}`;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getListoftrolleyService() {
    let scopeThis = this;
    this.spinner.show()
    this._listoftrolleyService.getlistoftrolleyapi(this.queryString, 1, this.paginationlength.pageSize).subscribe({
      next(data) {
        debugger;
        scopeThis.item = data
        console.log(scopeThis.item)
        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
        scopeThis.paginationlength.length = scopeThis.item.totalRecords;
        scopeThis.dataSource.sort = scopeThis.sort;
        scopeThis.spinner.hide()
        // console.log(scopeThis.paginationlength.length);
        // scopeThis.imagetodisplay = 'data:image/jpeg;base64,' + scopeThis.item.data[0].image
        // console.log(data)
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }
      }
    })

  }

  trollytabledisplay() {
    if (this._common.listoftrolleytable == true) {
      this.getListoftrolleyService();
    }
  }

  pagechange(event: any) {
    this.spinner.show()
    // debugger;
    let scopeThis = this;
    this._listoftrolleyService.getlistoftrolleyapi(this.queryString, event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        // debugger;
        scopeThis.item = data;

        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
        scopeThis.paginationlength.length = scopeThis.item.totalRecords;
        // scopeThis.dataSource.paginator = scopeThis.trolleyPage;
        scopeThis.spinner.hide()
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }
      }
    })
  }

  applyFilter() {
    // debugger;
    let scopeThis = this;
    debugger;
    this._listoftrolleyService.getsearchapi(this.queryString).subscribe({
      next(data) {
        scopeThis.item = data;
        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
        scopeThis.paginationlength.length = scopeThis.item.totalRecords;
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }
      }
    })
  }

  getrowid(ID: number) {
    this.router.navigate(['/dashboard/editrow', ID]);
  }


  idsarr: any = [];
  getallids(isChecked: boolean) {
    console.log(isChecked)
    if (isChecked) {
      for (let i = 0; i < this.item.totalRecords; i++) {
        this.idsarr.push(this.item.data[i].id)
        console.log(this.idsarr)
      }
    }
  }
  onChecked(val: any, isChecked: boolean) {
    console.log(val, isChecked)
    // this.idsarr.push(val);
    if (isChecked == false) {
      console.log(val)
      debugger;
      for (let i = 0; i < this.idsarr.length; i++) {
        if (this.idsarr[i] == val) {
          this.idsarr.splice(i, 1)
        }
      }
      console.log(this.idsarr)
    } if (isChecked == true) {
      this.idsarr.push(val);
      console.log(this.idsarr)
    }
  }



  @ViewChild(PrintQrcodeComponent)


  printvalue: any
  printqrCode(printqr) {
    this.spinner.show();
    let scopeThis = this
    this._listoftrolleyService.getPrintCheckedQRImage(this.idsarr).subscribe({
      next(data) {
        // debugger
        let printqrimage: any = [];
        printqrimage = data;
        // console.log(printqrimage)
        scopeThis.printvalue = printqrimage.map(x => ({
          qrimage: x.qrCodeImage,
          qrcode: x.qrCode,
          trolleymodel: x.trolleyModel,
          trolleynum: x.trolleyNumber,
          trolleycolor: x.trolleyColour
        }))
        console.log(scopeThis.printvalue.length)
        if (scopeThis.printvalue.length == 0) {
          scopeThis._common.openSnackbar('No row selected')
        } else {
          setTimeout(() => {
            scopeThis.printfile(printqr);
          }, 1000)
        }
        scopeThis.spinner.hide();
        // window.print()
        // console.log('outside next', scopeThis.printvalue[0].qrcode)
      }
    })



  }

  printfile(printqr) {
    let printContents = document.getElementById(printqr).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload()
  }  

}
