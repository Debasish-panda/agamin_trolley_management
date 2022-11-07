import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BuildingType, FloorList, FloorType, LocationType, SectionList } from '../types/locationtype';
import { MatDialog } from '@angular/material/dialog';
import { LocationComponent } from './location/location.component';
import { BuildingComponent } from './building/building.component';
import { FloorComponent } from './floor/floor.component';
import { SectionComponent } from './section/section.component';
import { CompanyService } from '../api/setup/company.service';
import { Pagination } from '../models/pagination';
import { CommonService } from '../api/common/common.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-companylocation',
  templateUrl: './company-location.component.html',
  styleUrls: ['./company-location.component.css']
})
export class CompanylocationComponent implements OnInit {

  pageNumber: number = 0;

  locationpaginationlength: Pagination = new Pagination();
  buildingpaginationlength: Pagination = new Pagination();
  floorpaginationlength: Pagination = new Pagination();
  sectionpaginationlength: Pagination = new Pagination();

  dataSourcelocation = new MatTableDataSource<LocationType>;
  dataSourcebuilding = new MatTableDataSource<BuildingType>;
  dataSourcefloor = new MatTableDataSource<FloorList>;
  dataSourcesection = new MatTableDataSource<SectionList>;

  locationtable: any;
  locationDropdown: any;
  locationid: number = 0;
  buildingDropdown: any;
  buildingid: number = 0;
  floorDropdown: any;
  floorid: number = 0;
  buildingtable: any;
  floortable: any;
  sectiontable: any;

  columnsToDisplayLocation: string[] = ['locationCode', 'name', 'description', 'address', 'suite', 'city', 'state', 'pincode', 'country', 'action'];
  columnsToDisplayBuilding: string[] = ['buildingCode', 'name', 'action'];
  columnsToDisplayFloor: string[] = ['floorCode', 'name', 'action'];
  columnsToDisplaySection: string[] = ['sectionCode', 'name', 'action'];

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  ngAfterViewInit() {
  }

  constructor(
    public dialog: MatDialog,
    private _company: CompanyService,
    private _common: CommonService,
    private _router: Router,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) { }

  openLocationDialog() {
    const dialogRef = this.dialog.open(LocationComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openBuildingDialog() {
    const dialogRef = this.dialog.open(BuildingComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openFloorDialog() {
    const dialogRef = this.dialog.open(FloorComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openSectionDialog() {
    const dialogRef = this.dialog.open(SectionComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    // const refresh = interval(1000);
    // refresh.subscribe(val => {
    this.getlocationtableapi();
    this.getnameParameterLocation()
    this.getnameParameterBuilding();
    this.getnameParameterFloor
    // })
  }

  display: any;

  getlocationtableapi() {
    this.spinner.show();
    let scopeThis = this;
    this._company.getCompanyLocationTable(1, this.locationpaginationlength.pageSize).subscribe({
      next(data) {
        // debugger;
        scopeThis.locationtable = data;
        console.log(scopeThis.locationtable.locations);
        scopeThis.dataSourcelocation = new MatTableDataSource<LocationType>(scopeThis.locationtable.locations);
        scopeThis.locationpaginationlength.length = scopeThis.locationtable.totalCount;
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  locationpagechange(event: any) {
    this.spinner.show();
    // debugger;
    let scopeThis = this;
    // console.log(event);
    this._company.getCompanyLocationTable(event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        // debugger;
        scopeThis.locationtable = data
        scopeThis.locationpaginationlength.length = scopeThis.locationtable.totalCount;
        scopeThis.dataSourcelocation = new MatTableDataSource<any>(scopeThis.locationtable.locations);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session Expired Re-Login Again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  modalRef?: BsModalRef;
  rowId: number;
  rowValue: string;
  openModal(template: TemplateRef<any>, id: number, value: any) {
    console.log(value);
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    if (value == 'location') { this.rowId = id; this.rowValue = value; }
    if (value == 'building') { this.rowId = id; this.rowValue = value; }
    if (value == 'floor') { this.rowId = id; this.rowValue = value; }
    if (value == 'section') { this.rowId = id; this.rowValue = value; }

  }
  confirm(): void {
    if (this.rowValue = 'location') {
      this.deletelocationrow(this.rowId);
    }
    if (this.rowValue = 'building') {
      this.deletebuildingrow(this.rowId);
      this.getbuildingtable();
    }
    if (this.rowValue = 'floor') {
      this.deletefloorrow(this.rowId);
      this.getFloortable();
    }
    if (this.rowValue = 'section') {
      this.deletesectionrow(this.rowId);
    }
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
    if (this.rowValue = 'location') {
      this.getlocationtableapi();
    }
    // if (this.rowValue = 'building') {
    //   this.getbuildingtable();
    // }
    // if (this.rowValue = 'floor') {
    //   this.getFloortable()
    // }
    if (this.rowValue = 'section') {
      this.sectiontable();
    }
  }
  deletelocationrow(id: number) {
    this.spinner.show();
    let scopeThis = this;
    this._company.deleteCompanyLocation(id).subscribe({
      next(data) {
        scopeThis._common.openSnackbar('Row Delted');
        // console.log(data);
        scopeThis.getlocationtableapi();
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })

  }

  deletebuildingrow(id: number) {
    this.spinner.show();
    let scopeThis = this;
    this._company.deleteCompanyBuilding(id).subscribe({
      next(data) {
        scopeThis._common.openSnackbar('Row Delted');
        // console.log(data);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })

  }
  deletefloorrow(id: number) {
    this.spinner.show();
    let scopeThis = this;
    this._company.deleteCompanyFloor(id).subscribe({
      next(data) {
        scopeThis.spinner.hide();
        scopeThis._common.openSnackbar('Row Delted');
        // console.log(data);
        // scopeThis.getFloortable();
        
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })

  }
  deletesectionrow(id: number) {
    this.spinner.show()
    let scopeThis = this;
    this._company.deleteCompanySection(id).subscribe({
      next(data) {

        scopeThis._common.openSnackbar('Row Delted');
        // console.log(data);
        scopeThis.spinner.hide();
        scopeThis.getlocationtableapi();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })

  }


  updateLocationrow(id: number) {
    this.dialog.open(LocationComponent, { data: id });
  }
  updateBuildingrow(id: number,) {
    this.dialog.open(BuildingComponent, { data: id });
  }
  updateFloorrow(id: number) {
    this.dialog.open(FloorComponent, { data: id });
  }
  updateSectionrow(id: number) {
    this.dialog.open(SectionComponent, { data: id });
  }



  getnameParameterLocation() {
    let scopeThis = this;
    this._company.getCompanyLocationDropdown().subscribe({
      next(data) {
        scopeThis.locationDropdown = data;
        scopeThis.locationid = scopeThis.locationDropdown.id

        // for (let i = 0; i < scopeThis.locationDropdown.length; i++) {
        //   scopeThis.valuestore.push(scopeThis.locationDropdown[i].id);
        //   // console.log(scopeThis.valuestore);
        // }
        // console.log(scopeThis.locationDropdown);
      },
      error(msg) {
        if (msg == 400) {
          scopeThis._common.openSnackbar('Enter mandatory input fields to save');
        }
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  lid: number = 0;
  getlocationid(val: number) {
    this.lid = val;
    this.getnameParameterBuilding();
  }


  getnameParameterBuilding() {
    // debugger;
    let scopeThis = this;
    this._company.getBuildingDropdown(this.lid).subscribe({
      next(data) {
        // debugger;
        scopeThis.buildingDropdown = data;
        // console.log(scopeThis.buildingDropdown)
        scopeThis.buildingid = scopeThis.buildingDropdown.id;
      },
      error(msg) {
        if (msg == 400) {
          scopeThis._common.openSnackbar('Enter mandatory input fields to save');
        }
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  Bid: number = 0;
  getbuildingid(val: number) {
    this.Bid = val;
    this.getnameParameterFloor();
  }



  getnameParameterFloor() {
    // debugger;
    let scopeThis = this;
    this._company.getFloorDropdown(this.Bid).subscribe({
      next(data) {
        scopeThis.floorDropdown = data;
        console.log(scopeThis.floorDropdown)
        scopeThis.floorid = scopeThis.floorDropdown.id;
      },
      error(msg) {
        if (msg == 400) {
          scopeThis._common.openSnackbar('Enter mandatory input fields to save');
        }
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }
  clickedlocationId: number;
  displaybuildingtable(val: number) {
    this.clickedlocationId = val;
    this.getbuildingtable()
  }


  getbuildingtable() {
    this.spinner.show();
    // debugger;
    // console.log(val);
    let scopeThis = this;
    this._company.getBuildingList(this.clickedlocationId, 1, this.buildingpaginationlength.pageSize).subscribe({
      next(data) {
        // debugger;
        scopeThis.buildingtable = data;
        if (scopeThis.buildingtable.totalCount == 0) {
          scopeThis._common.openSnackbar('No building data available.');
          scopeThis.dataSourcebuilding = new MatTableDataSource<any>(scopeThis.buildingtable.buildings);

        } else {
          // console.log(scopeThis.buildingtable.buildings);
          scopeThis.buildingpaginationlength.length = scopeThis.buildingtable.totalCount;
          scopeThis.dataSourcebuilding = new MatTableDataSource<any>(scopeThis.buildingtable.buildings);
          // console.log(scopeThis.dataSourcebuilding);
        }
        scopeThis.spinner.hide();

      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }
  buildingpagechange(event: any) {
    this.spinner.show();
    let scopeThis = this;
    this._company.getbuildingpagination(event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        scopeThis.buildingtable = data
        scopeThis.buildingpaginationlength.length = scopeThis.buildingtable.buildings
        scopeThis.dataSourcebuilding = new MatTableDataSource<any>(scopeThis.buildingtable.buildings)
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  clickedbuildingid: number
  displayfloortable(val: number) {
    this.clickedbuildingid = val;
    this.getFloortable()
  }

  getFloortable() {
    // debugger;
    // console.log(val);
    this.spinner.show();
    let scopeThis = this;
    this._company.getFloorList(this.clickedbuildingid, 1, this.floorpaginationlength.pageSize).subscribe({
      next(data) {
        // debugger;
        scopeThis.floortable = data;
        if (scopeThis.floortable.totalCount == 0) {          
          scopeThis._common.openSnackbar('No Floor data available');
          scopeThis.dataSourcefloor = new MatTableDataSource<any>(scopeThis.floortable.floors);
          scopeThis.spinner.hide();
        } else {
          // console.log(scopeThis.floortable);
          scopeThis.floorpaginationlength.length = scopeThis.floortable.floors;
          scopeThis.dataSourcefloor = new MatTableDataSource<any>(scopeThis.floortable.floors);
          scopeThis.spinner.hide();
          // console.log(scopeThis.dataSourcebuilding);
        }
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  floorpagechange(event: any) {
    this.spinner.show();
    let scopeThis = this;
    this._company.getBuildingList(this.clickedbuildingid, event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        scopeThis.floortable = data
        scopeThis.floorpaginationlength.length = scopeThis.floortable.floors
        scopeThis.dataSourcefloor = new MatTableDataSource<any>(scopeThis.floortable.floors);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  clickedfloorid: number
  displaysectiontable(val: number) {
    this.clickedfloorid = val;
    this.getSectiontable()
  }

  getSectiontable() {
    this.spinner.show();
    let scopeThis = this;
    this._company.getSectionList(this.clickedfloorid, 1, this.sectionpaginationlength.pageSize).subscribe({
      next(data) {
        debugger;
        scopeThis.sectiontable = data;
        if (scopeThis.sectiontable.totalCount == 0) {
          scopeThis._common.openSnackbar('No Section data available.');
          scopeThis.dataSourcesection = new MatTableDataSource<any>(scopeThis.sectiontable.sections);
          scopeThis.spinner.hide();
        } else {
          // console.log(scopeThis.sectiontable.sections);
          scopeThis.sectionpaginationlength.length = scopeThis.sectiontable.totalCount;
          scopeThis.dataSourcesection = new MatTableDataSource<any>(scopeThis.sectiontable.sections);
          scopeThis.spinner.hide();
          // console.log(scopeThis.dataSourcebuilding);
        }
      },
      error(msg) {

        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  sectionpagechange(event: any) {
    this.spinner.show();
    let scopeThis = this;
    this._company.getBuildingList(this.clickedfloorid, event.pageIndex + 1, event.pageSize).subscribe({
      next(data) {
        scopeThis.sectiontable = data
        scopeThis.sectionpaginationlength.length = scopeThis.sectiontable.totalCount;
        scopeThis.dataSourcesection = new MatTableDataSource<any>(scopeThis.sectiontable.sections);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }


}


