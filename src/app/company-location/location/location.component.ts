import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/api/common/common.service';
import { CompanyService } from 'src/app/api/setup/company.service';
import { Addnew } from 'src/app/models/setup/addnew';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';



@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  selected: string = 'India';
  receiveinput: any;
  addnewlocation: Addnew = new Addnew();

  latitude!: number;
  longitude!: number;

  latt!: number
  lngt!: number



  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  // displaymap() {
  //   debugger;
  //   var marker = new google.maps.Marker({
  //     position: new google.maps.LatLng(this.latt, this.lngt),
  //     map: this.mapss
  //   });
  // }
  constructor(
    private _company: CompanyService,
    private _common: CommonService,
    private _router: Router,
    public dialogRef: MatDialogRef<Addnew>,
    @Inject(MAT_DIALOG_DATA) public locationid: any) { }

  ngOnInit(): void {
    // console.log(this.locationid);
    this.getCompanyLocationrow();
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.center = {
    //     lat: 12.971599,
    //     lng: 77.4615581,
    //   }
    // })

  }
  display: any;
  // center: google.maps.LatLngLiteral = {
  //   lat: 24,
  //   lng: 12
  // };
  // zoom = 4;


  // moveMap(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) this.center = (event.latLng.toJSON());
  // }
  // move(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) this.display = event.latLng.toJSON();
  // }



  postCompanyLocationinput() {
    let scopeThis = this;
    this._company.postCompanyLocationinput(this.addnewlocation).subscribe({
      next(data) {
        // console.log(data);
        scopeThis._common.openSnackbar('Data saved successfuly');
        scopeThis._router.navigate(['dashboard/company-location']);
        scopeThis.addnewlocation.latitude;
        scopeThis.addnewlocation.longitude;
        scopeThis.dialogRef.close();
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
  ev: any;
  eventHandler(event: any, name: string) {
    // console.log(event, name);
    this.ev = event;
    if (name === 'mapDblclick') {

      this.dropMarker(event)
    }
  }

  getCompanyLocationrow() {
    let scopeThis = this;
    this._company.getCompanyLocationRow(this.locationid).subscribe({
      next(data) {
        scopeThis.addnewlocation = data;
        debugger;
        // console.log(scopeThis.addnewlocation);
        scopeThis.latt = scopeThis.addnewlocation.latitude;
        scopeThis.lngt = scopeThis.addnewlocation.longitude;
        // scopeThis.getmethod();
        // scopeThis.displaymap();
        scopeThis.dropMarker(null)
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  zoom = 4;

  // center: google.maps.LatLngLiteral;
  // mapOptions: google.maps.MapOptions = {
  //     center: { lat: 12.971599, lng: 77.4615581},
  //     zoom: 14
  //   }
  center = new google.maps.LatLng( 12.971599, 77.4615581)
  
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    streetViewControl: false,
    mapTypeControl: false
  }
  markers = [] as any;
  marker: any;
  infoContent = ''


  dropMarker(event: any) {
    if (event == null) {
      if (this.latt != 0 && this.lngt != 0) {
        // console.log(this.latt, this.lngt)
        this.markers.push({
          position: {
            lat: this.latt,
            lng: this.lngt,
          },
          // label: {
          //   color: 'blue',
          //   text: 'Marker label ' + (this.markers.length + 1),
          // },
          // title: 'Marker title ' + (this.markers.length + 1),
          options: {
            animation: google.maps.Animation.DROP,
          },
        })
      }
    }
    this.addnewlocation.latitude = event.latLng.lat();
    this.addnewlocation.longitude = event.latLng.lng();
    // console.log(this.addnewlocation.latitude, this.addnewlocation.longitude);
    // debugger;
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      // label: {
      //   color: 'blue',
      //   text: 'Marker label ' + (this.markers.length + 1),
      // },
      // title: 'Marker title ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.DROP,
      },
    })

  }
  clearPath() {
    this.markers = [] as any;
    // console.log(this.markers);
    this.dropMarker(this.ev);
  }

  updateCompanyLocationrow() {
    let scopeThis = this;
    this._company.putCompanyLocationRow(this.addnewlocation).subscribe({
      next(data) {
        // console.log(data);
        scopeThis.addnewlocation.id = scopeThis.locationid;
        scopeThis.dialogRef.close();
        scopeThis._common.openSnackbar('Row Updated successfuly');
        scopeThis.getCompanyLocationrow();
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
  // mapOptions: google.maps.MapOptions = {
  //   center: { lat: this.addnewlocation.latitude, lng: this.addnewlocation.longitude },
  //   zoom: 14
  // }
  // marker = {
  //   position: { lat: this.addnewlocation.latitude, lng: this.addnewlocation.longitude },
  // }






  mapss: any;
  @ViewChild('map') mapElement: any;
  lat = 12.971599;
  lng = 77.4615581;
  // markerss = [
  //   { lat: this.latt, lng: this.lngt }
  // ];
  getmethod() {
    // console.log(this.latt, this.lngt);
    const mapProperties = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.mapss = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    // this.markerss.forEach(location => {
    //   var marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(location.lat, location.lng),
    //     map: this.mapss
    //   });
    // });


    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.latt, this.lngt),
      map: this.mapss
    });

  }

}




