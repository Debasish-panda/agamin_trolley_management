import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Tabletype } from '../types/tabletype';
import { MatSort } from '@angular/material/sort';
import { TrolleyService } from '../api/trolley/trolley.service';
import { Pagination } from '../models/pagination';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../api/common/common.service';
import { TrolleyArea } from '../types/trolleymovement';

@Component({
  selector: 'app-trolleys',
  templateUrl: './trolleys.component.html',
  styleUrls: ['./trolleys.component.css']
})
export class TrolleysComponent implements OnInit, AfterViewInit {
  item: any;
  query: string = "";
  area: string = "";
  pagenumber: number = 1;
  pagesize: number = 0;
  dataSource = new MatTableDataSource<Tabletype>;
  paginationlength: Pagination = new Pagination();
  areasearch: any;
  trolleyareaval: any;


  constructor(private _trolleymovement: TrolleyService,
    private router: Router,
    private _common: CommonService
  ) { }


  ngOnInit(): void {
    this.gettrolleyMovementapi();
    this.addsearchtrolley();
    this.getTrolleyArea();
  }
  displayedColumns: string[] = ['id', 'image', 'bleTagId', 'trolleyModel', 'typeOfParts', 'numberOfParts', 'previousArea', 'currentArea', 'arrivalTime', 'findonmap'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  artime: any

  gettrolleyMovementapi() {
    let scopeThis = this;
    this._trolleymovement.gettrolleylist(this.query, this.pagenumber, this.paginationlength.pageSize).subscribe({
      next(data) {
        scopeThis.item = data;
        scopeThis.dataSource = new MatTableDataSource<Tabletype>(scopeThis.item.data);
        scopeThis.paginationlength.length = scopeThis.item.totalRecords;
        scopeThis.dataSource.sort = scopeThis.sort;
        scopeThis.artime = scopeThis.item.data[0].arrivalTime;

        console.log(scopeThis.artime);
        // console.log(scopeThis.items.data);
      }, error(msg) {
        if (msg == '401') {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again')
          scopeThis.router.navigate(['login']);
        }
      }
    }
    )
  }
  pagechange(event: any) {
    debugger;
    let scopeThis = this;
    this._trolleymovement.gettrolleylist(this.query, event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        debugger;
        scopeThis.item = data
        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
        scopeThis.paginationlength.length = scopeThis.item.totalRecords;
        // scopeThis.dataSource.paginator = scopeThis.trolleyPage;
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis.router.navigate(['login']);
        }

      }
    })
  }

  addsearchtrolley() {
    let scopeThis = this;
    this._trolleymovement.getsearchtrolleylist(this.query, this.trolleyareaval).subscribe({
      next(data) {
        if (data.totalRecords == 0) {          
          scopeThis.item = data;
          scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
          scopeThis.paginationlength.length = scopeThis.item.totalRecords;
          scopeThis._common.openSnackbar('No data found')
        } else {
          scopeThis.item = data;
          scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.item.data);
          scopeThis.paginationlength.length = scopeThis.item.totalRecords;
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
  getTrolleyArea() {
    let scopeThis = this;
    this._trolleymovement.gettrolleyarea().subscribe({
      next(data) {
        scopeThis.areasearch = data;
      }
    })
  }


  selectval(val: any) {
    console.log(val);
  }

  //   filteredtable(val:any){
  //     debugger;
  // console.log(val);
  //   }




  filtervalue(val: any) {
    this.trolleyareaval = val;
    console.log(val)
    if (val == "Select Area/Zone") {
      this.trolleyareaval = "";
      this.addsearchtrolley();
    } else {
      this.addsearchtrolley();
    }
  }
}
