import { DataSource } from '@angular/cdk/collections';
import { R3SelectorScopeMode } from '@angular/compiler';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { tickStep } from 'd3';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../api/common/common.service';
import { CompanyService } from '../api/setup/company.service';
import { LocationLatLng } from '../models/listmap/map';
import { Floormap } from '../models/map/floormap';
import { Pagination } from '../models/pagination';
import { Maptabletype } from '../types/maptabletype';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit {

  locationList: any;
  latitude: any;
  longitude: any;
  location_latlng: LocationLatLng = new LocationLatLng();
  namearr = [];
  paginationlength: Pagination = new Pagination();

  hidepopbox: boolean = false;
  hidebuildingmap: boolean = false;
  buildingcontainer: boolean = true;

  displayedColumns: string[] = ['assettagid', 'description', 'action'];
  dataSource = new MatTableDataSource<any>;
  tablevalue: any;

  visiblebuildingmap = 'none';
  visiblefloor = 'none'
  floorcontainer: boolean = true;
  visiblesection = 'none';
  sectioncontainer: boolean = true;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild('matgroup') matGroup: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private _comon: CommonService,
    private _company: CompanyService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.getCordlocation();

    // this.initMap();
  }
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12
  };
  zoom = 4;
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  // position= new google.maps.LatLng(19.70551497799608, 75.57388188124999)

  locationvalue: any = [];
  getCordlocation() {
    this.spinner.show();
    let scopeThis = this
    this._company.getLocationListMap().subscribe({
      next(data) {
        scopeThis.locationList = data;
        // console.log(scopeThis.locationList);
        for (let i = 0; i < scopeThis.locationList.length; i++) {
          scopeThis.location_latlng.locationcord.push({ lat: scopeThis.locationList[i].latitude, lng: scopeThis.locationList[i].longitude, id: scopeThis.locationList[i].id, name: scopeThis.locationList[i].name });
          scopeThis.namearr.push(scopeThis.locationList[i].name);
        }
        // console.log(scopeThis.location_latlng.locationcord);
        scopeThis.getmethod();
        for (let i = 0; i < scopeThis.locationList.length; i++) {
          scopeThis.locationvalue.push({
            lat: scopeThis.locationList[i].latitude,
            lng: scopeThis.locationList[i].longitude,
            name: scopeThis.locationList[i].name,
            id: scopeThis.locationList[i].id
          })
        }
        scopeThis.spinner.hide();
      }, error(msg) {
        if (msg == '401') {
          scopeThis._comon.openSnackbar('Session expired login again')
          scopeThis.router.navigate(['login']);
        }
      }
    }
    )
  }
  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }

  // map: any;
  // @ViewChild('map') mapElement: any;
  // lat = 12.971599;
  // lng = 77.4615581;
  // getmethod() {
  //   const mapProperties = {
  //     center: new google.maps.LatLng(this.lat, this.lng),
  //     zoom: 6,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  //   var marker = new google.maps.Marker({
  //     position: new google.maps.LatLng(77.58156654091444, 12.925582322611165),
  //     map: this.map
  //   });

  // }


  mapss: any;
  @ViewChild('map', { static: true }) map: any;
  lat = 12.971599;
  lng = 77.4615581;
  locationId: number;
  name:string;

  getmethod() {
    const mapProperties = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false
    };
    this.mapss = new google.maps.Map(this.map.nativeElement, mapProperties);
    let marks = this.location_latlng.locationcord.slice(1);
    JSON.stringify(marks);
    // console.log(marks)
    for (let i = 0; i < this.namearr.length; i++) {
      // console.log(this.namearr[i]);
    }
    let marker;
    marks.forEach(location => {
      marker = new google.maps.Marker({
        // animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.mapss
      });
      marker.addListener("click", () => {
        this.locationId = location.id;
        this.name=location.name
        console.log(location.name)
        this.matGroup.selectedIndex = 1;
        this.buildingcontainer = false;
        this.getCordBuilding();
      })      
       var infowindow =  new google.maps.InfoWindow({
        content: location.name
      });
      // infowindow.open(this.map, marker);
      google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.open(this.map, this);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
      });

      // marker.addListener("mouseover", () => {
      //   inforwin.open({
      //     anchor: marker,
      //     map:this.mapss
      //   });
      // })
      // marker.addListener("mouseout", () => {
      //   inforwin.close();
      //  })
    });
   

    // marker.addListener("click", toggleBounce());
    // function toggleBounce() {
    //   debugger;
    //   if (marker.getAnimation() !== null) {
    //     marker.setAnimation(null);
    //   } else {
    //     marker.setAnimation(google.maps.Animation.BOUNCE);
    //   }
    // }

  }
  buildingdata: any;
  buildingpath = [];
  selectedLocation: any;
  getCordBuilding() {
    this.spinner.show();
    let scopeThis = this;
    this._company.getBuildingListmap(this.locationId).subscribe({
      next(data) {
        scopeThis.buildingdata = data;
        // console.log(scopeThis.buildingdata);
        if(scopeThis.buildingdata.length == 0){
          scopeThis._comon.openSnackbar('No building cordinate available');
          scopeThis.spinner.hide();
        }else{
          scopeThis.visiblebuildingmap = 'block'
          scopeThis.hidebuildingmap = true;
          scopeThis.spinner.hide();
        }
        scopeThis.buildinglatlngValue(scopeThis.buildingdata);
        scopeThis.selectedLocation = scopeThis.locationId;
        
      }
    })
  }

  @ViewChild('buildingmap', { static: true }) buildingmap: any;
  bmap: any;
  buildinglatlngValue(bdata: any) {
    // let buildingcords = this.buildingdata[1]
    // console.log(buildingcords)
    // for (let i = 0; i < buildingcords.buildingCoordinates.length; i++) {
    //   this.buildingpath.push({ lat: buildingcords.buildingCoordinates[i].latitude, lng: buildingcords.buildingCoordinates[i].longitude })
    // }
    // this.buildingMap();
    // console.log(this.buildingpath)
    debugger;
    console.log(bdata);
    let selectedLocationDetails = this.locationvalue.find(x => x.id === this.selectedLocation);
    let latitude, longitude;
    if (bdata[0]?.buildingCoordinates[0]?.latitude) {
      latitude = bdata[0]?.buildingCoordinates[0]?.latitude;
    } else {
      latitude = selectedLocationDetails.lat;
    }
    if (bdata[0]?.buildingCoordinates[0]?.longitude) {
      longitude = bdata[0]?.buildingCoordinates[0]?.longitude
    } else {
      longitude = selectedLocationDetails.lng;
    }

    const mapProperties = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 18,
    };
    this.bmap = new google.maps.Map(this.buildingmap?.nativeElement, mapProperties);
    let buildingC;
    for (let i = 0; i < bdata.length; i++) {
      buildingC = bdata[i]?.buildingCoordinates
      console.log(buildingC);
      let cPoint = buildingC.map(item => {
        return {
          lat: item?.latitude,
          lng: item?.longitude
        };
      });
      console.log(cPoint);
      if (cPoint.length > 0) {
        const drawshape = new google.maps.Polygon({
          paths: cPoint,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });
        drawshape.setMap(this.bmap);
        if (drawshape) {
          drawshape.addListener('click', () => {
            this.matGroup.selectedIndex = 2;
            debugger;
            this.getFloorMapcoords(bdata[i].id)
          })
        }
      }
    }

  }

  imageval: SafeUrl;
  img: Blob;
  blobimg: any;
  bid: number;

  getFloorMapcoords(buildingId: number) {
    this.spinner.show();
    let scopeThis = this;
    this.bid = buildingId;
    debugger;
    this._company.getBuildingimage(buildingId).subscribe({
      next(data) {
        scopeThis.img = data;
        console.log(scopeThis.img)
        scopeThis.imageval = scopeThis.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
        scopeThis.blobimg = (URL.createObjectURL(data));
        d3.select('#buildingImg').attr('href', URL.createObjectURL(data));
        scopeThis.spinner.hide();
      }
    })
  }

  onBuildingImageLoad() {
    this.visiblefloor = 'block';
    this.floorcontainer = false;

    d3.select('#buildingDrawArea').selectAll("path").remove();
    let img = new Image();
    img.src = d3.select('#buildingImg').attr('href');

    img.onload = function (event) {
      let loadedImage = (<HTMLInputElement>event.currentTarget);
      let width = loadedImage.width;
      let height = loadedImage.height;
      let svg = d3.select('#buildingDrawArea');
      svg.attr("viewBox", `0 0 ${width} ${height}`);
    }
    let scopeThis = this;
    this._company.getFloorMap(this.bid).subscribe({
      next(data) {
        data.forEach(mapCoords => {
          let pathPoints = JSON.parse(mapCoords.mapCoords ? mapCoords.mapCoords : null);
          if (pathPoints?.length > 0) {
            scopeThis.createBuildingMap(pathPoints, mapCoords.id, scopeThis);
          }
        })
      }
    })
  }

  cRef;
  flrId;
  hidePopup: boolean = false;
  private createBuildingMap(pathPoints, floorId, scopeThis) {
    const self = this;
    var lineGenerator = d3.line();
    var pathString = lineGenerator(pathPoints);
    var svg = d3.select("#buildingDrawArea");

    var bbox = d3.select<SVGSVGElement, unknown>('#buildingImg').node().getBBox();
    var cReact = document.getElementById('buildingImg').getBoundingClientRect();
    let xFactor = bbox.width / cReact.width;

    svg.append("path")
      .attr('d', pathString)
      .attr('fill', 'darkkhaki')
      .style('opacity', 0.5)
      .style('stroke-width', xFactor)
      .style('stroke', 'red')
      .on('click', function (d) {
        // componentRef.loadFloorImage(componentRef, floorId)
        self.hidePopup = true;
        self.cRef = scopeThis;
        self.flrId = floorId;
        self.getfloortable();
      })

      .on("mouseover", function (d) {
        d3.select(this).style('opacity', '0.8');
      })
      .on('mouseout', function (d) {
        d3.select(this).style('opacity', '0.5');
      });
    return svg;
  }

  gotoSection() {
    this.visiblesection = 'block';
    this.sectioncontainer = false;
    this.matGroup.selectedIndex = 3;
    this.getSectionMapCoords(this.flrId)
  }

  getSectionMapCoords(id) {
    debugger;
    // this.spinner.show();
    let scopeThis = this;
    this._company.getFloorimage(id).subscribe({
      next(data) {
        console.log(data)
        scopeThis.img = data;
        scopeThis.imageval = scopeThis.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
        scopeThis.blobimg = (URL.createObjectURL(data));
        d3.select('#floorImg').attr('href', URL.createObjectURL(data));
        scopeThis.spinner.hide()
      }
    })
  }
  onFloorImageLoad() {
    d3.select('#floorDrawArea').selectAll("path").remove();
    let img = new Image();
    img.src = d3.select('#floorImg').attr('href');

    img.onload = function (event) {
      let loadedImage = (<HTMLInputElement>event.currentTarget);
      let width = loadedImage.width;
      let height = loadedImage.height;
      let svg = d3.select('#floorDrawArea');
      svg.attr("viewBox", `0 0 ${width} ${height}`);
    }
    let scopeThis = this;
    this._company.getSectionMap(this.flrId).subscribe({
      next(data) {
        data.forEach(mapCoords => {
          let pathPoints = JSON.parse(mapCoords.mapCoords ? mapCoords.mapCoords : null);
          if (pathPoints?.length > 0) {
            scopeThis.createFloorMap(pathPoints, mapCoords.id, scopeThis);
          }
        })
      }
    })
  }

  sId: any;
  private createFloorMap(pathPoints, sectionid, scopeThis) {
    const self = this;
    var lineGenerator = d3.line();
    var pathString = lineGenerator(pathPoints);
    var svg = d3.select("#floorDrawArea");

    var bbox = d3.select<SVGSVGElement, unknown>('#floorImg').node().getBBox();
    var cReact = document.getElementById('floorImg').getBoundingClientRect();
    let xFactor = bbox.width / cReact.width;

    svg.append("path")
      .attr('d', pathString)
      .attr('fill', 'darkkhaki')
      .style('opacity', 0.5)
      .style('stroke-width', xFactor)
      .style('stroke', 'red')
      .on('click', function (d) {
        self.cRef = scopeThis;
        self.sId = sectionid;
      })

      .on("mouseover", function (d) {
        d3.select(this).style('opacity', '0.8');
      })
      .on('mouseout', function (d) {
        d3.select(this).style('opacity', '0.5');
      });
    return svg;
  }

  pagenum: number = 1;
  getfloortable() {
    this.spinner.show();
    let scopeThis = this;
    this._company.getTrolleysByFloor(this.locationId, this.bid, this.flrId, 1, this.paginationlength.pageSize).subscribe({
      next(data) {
        scopeThis.tablevalue = data
        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.tablevalue.data);
        scopeThis.paginationlength.length = scopeThis.tablevalue.totalRecords
        console.log(scopeThis.tablevalue);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 400)
          scopeThis._comon.openSnackbar('Session timed out Re-login..');
      }
    })
  }
  getsectiontable() {
    this.spinner.show();
    let scopeThis = this;
    this._company.getTrolleysBySection(this.locationId, this.bid, this.flrId, this.sId, 1, this.paginationlength.pageSize).subscribe({
      next(data) {
        scopeThis.tablevalue = data
        scopeThis.dataSource = new MatTableDataSource<any>(scopeThis.tablevalue.data);
        scopeThis.paginationlength.length = scopeThis.tablevalue.totalRecords
        console.log(scopeThis.tablevalue);
        scopeThis.spinner.hide();
      },
      error(msg) {
        if (msg == 400)
          scopeThis._comon.openSnackbar('Session timed out Re-login..');
      }
    })
  }
}


