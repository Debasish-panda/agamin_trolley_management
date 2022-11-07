
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/api/common/common.service';
import { CompanyService } from 'src/app/api/setup/company.service';
import { Pagination } from 'src/app/models/pagination';
import { Addbuilding, Buildingcord } from 'src/app/models/setup/addbuilding';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  displaymap: boolean = true;
  pagenumber: number = 0;
  pagesize: number = 0;
  selectLocation: any;
  buildingPagination: Pagination = new Pagination();
  addnewBuilding: Addbuilding = new Addbuilding();
  locationid: any = [];
  buildingcord: Buildingcord = new Buildingcord();

  image!: File;
  public avatarURL: any;
  fileToUpload!: File;
  visibleornot = 'none';

  constructor(
    private _company: CompanyService,
    private _common: CommonService,
    private _router: Router,
    public dialogRef: MatDialogRef<Addbuilding>,
    @Inject(MAT_DIALOG_DATA) public buildingid: any
  ) { }

  ngOnInit(): void {

    if (this.buildingid == null) {
      this.visibleornot = 'block'
      this.polylineval();
    }

    this.getnameParameterLocation();
    // this.setCurrentPosition();
    // this.getmethod();
    this.getBuildingrow();

  }
  // private setCurrentPosition() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //     });
  //   }
  // }

  // url: any;
  // onSelectFile(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.onload = () => {
  //       this.url = event.target.result;
  //     }
  //     reader.readAsDataURL(event.target.files[0]);

  //   }

  // url: any;
  // previewFile(event: any) {
  //   let reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     console.log(file);
  //     let formData = new FormData();
  //     formData.append("myfile", file);
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.url = reader.result;
  //       console.log(this.url);
  //     };
  //   }
  // }
  url: any;
  previewFile(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      // console.log(file);
      let formData = new FormData();
      formData.append("myfile", file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.url = reader.result;
        // console.log(this.url);
      };
    }
  }
  getnameParameterLocation() {
    let scopeThis = this;
    this._company.getCompanyLocationDropdown().subscribe({
      next(data) {
        scopeThis.selectLocation = data;
        console.log(scopeThis.selectLocation)
        // console.log(scopeThis.selectLocation);   
        for (let i = 0; i < scopeThis.selectLocation.length; i++) {
          scopeThis.locationid.push(scopeThis.selectLocation[i].id);
          // console.log(scopeThis.locationid);
        }
        // console.log(scopeThis.locationid);
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  postBuildingInput() {
    let scopeThis = this;
    this._company.postBuildingInput(this.addnewBuilding).subscribe({
      next(data) {
        if (scopeThis.fileToUpload) {
          scopeThis._company.postbuildingimageapi(data.id, scopeThis.fileToUpload).subscribe({
            next(data) {
              debugger;
              scopeThis.polylineval();
            }
          })
        }
        scopeThis.dialogRef.close();
        scopeThis._common.openSnackbar('Data saved successfuly');
      },
      error(msg) {
        if (msg == 400) {
          scopeThis._common.openSnackbar('Enter mandatory input fields to save');
        }
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis.dialogRef.close();
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }
  forwardid(val: any) {
    // for(let i = 0; i<this.locationid.length; i++)
    this.addnewBuilding.locationId = val;
    // console.log(this.addnewBuilding.locationId)

  }
selected_location_name:string;
  getBuildingrow() {
    let scopeThis = this;
    this._company.getCompanyBuildingRow(this.buildingid).subscribe({
      next(data) {
        // console.log(data.buildingCoordinates[0].latitude);
        debugger;
        scopeThis.addnewBuilding = data;
        console.log(scopeThis.addnewBuilding)
        scopeThis.selectLocation.forEach((res)=>{
          if(res.id ==scopeThis.addnewBuilding.locationId){
            scopeThis.selected_location_name = res.name
          }
        })
        // if(scopeThis.addnewBuilding.locationId == scopeThis.selectLocation)

        for (let i = 0; i < scopeThis.addnewBuilding.buildingCoordinates.length; i++) {
          debugger;
          scopeThis.buildingcord.coord.push({ lat: scopeThis.addnewBuilding.buildingCoordinates[i].latitude, lng: scopeThis.addnewBuilding.buildingCoordinates[i].longitude });
        }
        scopeThis.displaypolyline();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  changeAvatar(files: any) {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = files[0];
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log("Only images are supported.");
      this.image = mimeType
      console.log(mimeType);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.avatarURL = reader.result;
      console.log(this.avatarURL);
    };
  }
  updateBuildingrow() {
    let scopeThis = this;
    this._company.putCompanyBuildingRow(this.addnewBuilding).subscribe({
      next(data) {
        // scopeThis.addnewBuilding = data;
        scopeThis.addnewBuilding.id = scopeThis.buildingid;
        scopeThis.dialogRef.close();
        scopeThis._common.openSnackbar('Building updated successfully')
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis.dialogRef.close();
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  display: any;
  // moveMap(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) this.center = (event.latLng.toJSON());
  // }
  // move(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) this.display = event.latLng.toJSON();
  // }

  mapss: any;
  latt!: number
  lngt!: number
  lat = 12.909334794345313;
  lng = 77.58676756224061;
  @ViewChild('map', { static: true }) map: any;
  // drawingManager:any
  // getmethod() {
  //   // console.log(this.latt, this.lngt);
  //   const mapProperties = {
  //     center: new google.maps.LatLng(this.lat, this.lng),
  //     zoom: 6,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
  //   this.mapss = new google.maps.Map(this.map.nativeElement, mapProperties);
  //   const drawingManager = new google.maps.drawing.DrawingManager({
  //     drawingMode: google.maps.drawing.OverlayType.POLYLINE,
  // drawingControl: true,
  // drawingControlOptions: {
  //   position: google.maps.ControlPosition.TOP_CENTER,
  //   drawingModes: [
  //     google.maps.drawing.OverlayType.POLYLINE,
  //   ],
  // },
  // polylineOptions: {
  //   strokeWeight: 1,
  //   clickable: false,
  //   editable: true,
  //   zIndex: 1,
  // },
  //   });
  //   console.log(drawingManager.setMap(this.mapss));
  //   drawingManager.setMap(this.mapss);
  // }

  cordinate: any = [];
  polylineval() {
    const mapProperties = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false
    };
    this.mapss = new google.maps.Map(this.map.nativeElement, mapProperties);


    // const polypath = [
    //   { lat: 12.927002462146897, lng: 77.54240707863308 },
    //   { lat: 12.927078274827629, lng: 77.54254118908382 },
    //   { lat: 12.926897892894333, lng: 77.54265115965343 },
    //   { lat: 12.92681685169345, lng: 77.5425197314117 },
    //   { lat: 12.927002462146897, lng: 77.54240707863308 },
    // ];

    // var polypath = this.buildingcord.coord.splice(1);
    // console.log(polypath)
    // var setpolyline = new google.maps.Polyline({
    //   path: polypath,
    //   strokeColor: "red",
    //   strokeWeight: 1
    // })
    // setpolyline.setMap(this.mapss);

    var drawingmanager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      polylineOptions: {
        strokeWeight: 1,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    })
    drawingmanager.setMap(this.mapss)
    google.maps.event.addListener(drawingmanager, 'overlaycomplete', (event) => {
      if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
        var paths = event.overlay.getPath();
        for (var i = 0; i < paths.length; i++) {
          this.cordinate.push([paths.getAt(i).lat(), paths.getAt(i).lng()]);
        }
        var merge = this.cordinate.flat(1)
        console.log(merge);
        console.log(this.cordinate);
        var objs = this.cordinate.map(x => ({
          latitude: x[0],
          longitude: x[1]

        }));
        this.addnewBuilding.buildingCoordinates = objs;
      }
    })

  }

  clearPath() {
    this.polylineval();
  }

  tmap: any;
  @ViewChild('trialmap', { static: true }) trialmap: any;
  displaypolyline() {
    let latitude = this.buildingcord.coord[1].lat;
    let longitude = this.buildingcord.coord[1].lng;
    const mapProperties = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.tmap = new google.maps.Map(this.trialmap.nativeElement, mapProperties);
    let polypath = this.buildingcord.coord.splice(1);
    // console.log(polypath)
    var setpolyline = new google.maps.Polyline({
      path: polypath,
      strokeColor: "red",
      strokeWeight: 1
    })
    setpolyline.setMap(this.tmap);
  }



}

