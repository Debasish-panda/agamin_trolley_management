import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ɵɵsetComponentScope } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/api/common/common.service';
import { CompanyService } from 'src/app/api/setup/company.service';
import { Addfloor } from 'src/app/models/setup/addfloor';
import * as d3 from "d3";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css']
})
export class FloorComponent implements OnInit {

  locationDropdown: any;
  locationid: number = 0;
  buildingDropdown: any;
  addnewFloor: Addfloor = new Addfloor();

  image!: File;
  public avatarURL: any;
  fileToUpload!: File;

  redraw: boolean = false;
  points = [];
  activeLine: any;
  isDrawComplete: boolean = false;
  clickEventRef: any;
  moveEventRef: any;


  constructor(
    private _company: CompanyService,
    private _common: CommonService,
    private _router: Router,
    private renderer2: Renderer2,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<Addfloor>,
    @Inject(MAT_DIALOG_DATA) public floorid: any
  ) { }

  ngOnInit(): void {
    this.getnameParameterLocation();
    this.getFloorRow();

    this.moveEventRef = this.moveEvent.bind(this);
    this.clickEventRef = this.clickEvent.bind(this);

  }

  getnameParameterLocation() {
    let scopeThis = this;
    this._company.getCompanyLocationDropdown().subscribe({
      next(data) {
        scopeThis.locationDropdown = data;
        console.log(scopeThis.locationDropdown);
        scopeThis.locationid = scopeThis.locationDropdown.id
      },
      error(msg) {
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
        console.log(scopeThis.buildingDropdown)
        // scopeThis.buildingid = scopeThis.buildingDropdown.id;
        scopeThis.displayBuildingImage();
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }
  postFloorinput() {
    let scopeThis = this;
    this._company.postFloorInput(this.addnewFloor).subscribe({
      next(data) {
        if (scopeThis.fileToUpload) {
          scopeThis._company.postfloorimageapi(data.id, scopeThis.fileToUpload).subscribe({
            next(data) {

            }
          })
        }
        scopeThis._common.openSnackbar('Data saved successfuly');
        scopeThis.dialogRef.close();
      }, error(msg) {
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
  forwardid(val: number) {
    this.addnewFloor.buildingId = val;
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

  imageval: SafeUrl;
  img: Blob;
  blobimg: any;
  displayBuildingImage() {
    // debugger;
    let scopeThis = this;
    this._company.getBuildingimage(this.addnewFloor.buildingId).subscribe({
      next(data) {
        scopeThis.img = data;
        scopeThis.imageval = scopeThis.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
        console.log(scopeThis.imageval)
        scopeThis.blobimg = (URL.createObjectURL(data))
        console.log(scopeThis.blobimg);
        d3.select('#buildingImg').attr('href', URL.createObjectURL(data))


      }
    })
  }
  selected_location_name: string;
  selected_building_name: string;
  getFloorRow() {
    let scopeThis = this;
    this._company.getCompanyFloorRow(this.floorid).subscribe({
      next(data) {
        console.log(data);
        scopeThis.addnewFloor = data;
        scopeThis.displayBuildingImage();
        // debugger;
        scopeThis.locationDropdown.forEach((val: any) => {
          if (val.id == scopeThis.addnewFloor.locationId) {
            // console.log(val.name);
            scopeThis.selected_location_name = val.name;
            let bdvalue: any = [];
            scopeThis._company.getBuildingDropdown(val.id).subscribe((res) => {
              bdvalue = res;
              console.log(res);
              debugger;
              if (bdvalue.length != 0) {
                bdvalue.forEach((resp: any) => {
                  if (resp.id == scopeThis.addnewFloor.buildingId) {
                    scopeThis.selected_building_name = resp.name;
                    console.log(scopeThis.selected_building_name);
                  }
                })
              }
            })

          }
        })

      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }

  updateFloorRow() {
    let scopeThis = this;
    this._company.putCompanyFloorRow(this.addnewFloor).subscribe({
      next(data) {
        // scopeThis.addnewFloor = data;
        scopeThis.addnewFloor.id = scopeThis.floorid;
        scopeThis.dialogRef.close();
        scopeThis._common.openSnackbar('Floor updated Successfully');
        scopeThis.getFloorRow();
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


  clickEvent(e) {
    this.redraw = true;
    var bbox = d3.select<SVGSVGElement, unknown>('#buildingImg').node().getBBox();
    var cReact = document.getElementById('buildingImg').getBoundingClientRect();
    let xFactor = bbox.width / cReact.width;
    let yFactor = bbox.height / cReact.height;
    var x = (e.clientX - cReact.left) * xFactor; //x position within the element.
    var y = (e.clientY - cReact.top) * yFactor;  //y position within the element.

    var svg = d3.select("#drawArea");
    if (this.points.length > 0) {
      var line = svg.append("line")
        .style("stroke", "red")
        .attr("x1", this.points[this.points.length - 1][0])
        .attr("y1", this.points[this.points.length - 1][1])
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke-width", xFactor);

      var a = (this.points[0][0] - x) / xFactor;
      var b = (this.points[0][1] - y) / yFactor;
      var c = Math.sqrt(a * a + b * b);

      if (c < 5) {
        this.points.push(this.points[0]);
        this.createMap(this.points);
        this.addnewFloor.mapCoords = JSON.stringify(this.points);
        this.points = [];
        this.isDrawComplete = true;

        document.getElementById("drawArea").removeEventListener('mousemove', this.moveEventRef);
        document.getElementById("drawArea").removeEventListener('click', this.clickEventRef);
      }
      else {
        this.points.push([x, y]);
      }

    }
    else {
      this.points.push([x, y]);
    }

    this.activeLine = this.activeLine ?
      this.activeLine
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", y) :
      svg.append("line")
        .style("stroke", "red")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke-width", xFactor);
    if (!this.isDrawComplete) {
      document.getElementById("drawArea").addEventListener('mousemove', this.moveEventRef);
    }
  }

  moveEvent(e) {
    var bbox = d3.select<SVGSVGElement, unknown>('#buildingImg').node().getBBox();
    var cReact = document.getElementById('buildingImg').getBoundingClientRect();
    let xFactor = bbox.width / cReact.width;
    let yFactor = bbox.height / cReact.height;
    var rect = e.target.getBoundingClientRect();
    var x = (e.clientX - rect.left) * xFactor; //x position within the element.
    var y = (e.clientY - rect.top) * yFactor;  //y position within the element.
    this.activeLine.attr("x2", x)
      .attr("y2", y);
  }

  private createMap(pathPoints) {
    var lineGenerator = d3.line();
    var pathString = lineGenerator(pathPoints);
    let d3Selection: d3.Selection<SVGSVGElement, {}, HTMLElement, any>

    var svg = d3.select("#drawArea");
    var bbox = d3.select<SVGSVGElement, unknown>('#buildingImg').node().getBBox();
    var cReact = document.getElementById('buildingImg').getBoundingClientRect();
    let xFactor = bbox.height / cReact.width;
    let yFactor = bbox.height / cReact.height;
    var path = svg.append("path");
    path.attr('d', pathString)
      .attr('fill', 'darkkhaki')
      .style('opacity', 0.5)
      .style('stroke-width', xFactor)
      .style('stroke', 'red')
      .on('mouseover', function (d) {
        d3.select(this).style('opacity', '0.8');
      })
      .on('mouseout', function (d) {
        d3.select(this).style('opacity', '0.5');
      });
    return svg;
  }
  onImageLoad() {
    document.getElementById("drawArea").addEventListener('click', this.clickEventRef);
    let img = new Image();
    img.src = d3.select('#buildingImg').attr('href');
    let pathPoints = JSON.parse(this.addnewFloor.mapCoords ? this.addnewFloor.mapCoords : null);
    let pathFunction = this.createMap;

    img.onload = function (event) {
      let loadedImage = (<HTMLInputElement>event.currentTarget);
      let width = loadedImage.width;
      let height = loadedImage.height;

      let svg = d3.select('#drawArea');
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      if (pathPoints?.length > 0) {
        pathFunction(pathPoints);
      }
    }
  }

  deleteSelectedShape() {
    d3.select("#drawArea").selectAll('line').remove();
    d3.select("#drawArea").selectAll('path').remove();
    this.points = [];
    this.activeLine = undefined;
    this.redraw = false;
    this.isDrawComplete = false;
    document.getElementById("drawArea").addEventListener('click', this.clickEventRef);
  }



}





