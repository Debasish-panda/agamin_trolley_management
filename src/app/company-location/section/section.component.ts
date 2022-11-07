import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { CommonService } from 'src/app/api/common/common.service';
import { CompanyService } from 'src/app/api/setup/company.service';
import { AddSection } from 'src/app/models/setup/add-section';


@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  locationDropdown: any;
  locationid: number = 0;
  buildingDropdown: any;
  addnewSection: AddSection = new AddSection();
  floorDropdown: any;
  floorid: number = 0;
  buildingid = 0;

  image!: File;
  public avatarURL: any;
  fileToUpload!: File;

  clickeventRef: any;
  redraw: boolean = false;
  points = [];
  isDrawComplete: boolean = false;
  moveEventRef: any;
  clickEventRef: any;
  activeLine: any;

  constructor(
    private _company: CompanyService,
    private _common: CommonService,
    private _router: Router,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AddSection>,
    @Inject(MAT_DIALOG_DATA) public sectionid: any

  ) { }

  ngOnInit(): void {
    this.getnameParameterLocation();
    this.getSectionRow();

    this.moveEventRef = this.moveEvent.bind(this);
    this.clickEventRef = this.clickEvent.bind(this);
  }

  getnameParameterLocation() {
    // debugger;
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
    debugger;
    let scopeThis = this;
    this._company.getBuildingDropdown(this.lid).subscribe({
      next(data) {
        debugger;
        scopeThis.buildingDropdown = data;
        // console.log(scopeThis.buildingDropdown)
        scopeThis.buildingid = scopeThis.buildingDropdown.id;
      },
      error(msg) {
        if (msg === '400') {
          scopeThis._common.openSnackbar('Enter mandatory input fields to save');
        }
        if (msg === '401') {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
          // scopeThis.dialogRef.close();
        }
      }
    })
  }

  Bid: number = 0;
  getBuildingid(val: number) {
    this.Bid = val;
    this.getnameParameterFloor();
  }
  getnameParameterFloor() {
    debugger;
    let scopeThis = this;
    this._company.getFloorDropdown(this.Bid).subscribe({
      next(data) {
        scopeThis.floorDropdown = data;
        console.log(scopeThis.floorDropdown)
        scopeThis.floorid = scopeThis.floorDropdown.id;
        scopeThis.displayFloorImage();
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


  postSectioninput() {
    let scopeThis = this;
    this._company.postSectionInput(this.addnewSection).subscribe({
      next(data) {
        // console.log(data);
        scopeThis._common.openSnackbar('Data saved successfuly');
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
  forwardfloorid(val: number) {
    this.addnewSection.floorId = val;

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
  displayFloorImage() {
    let scopeThis = this;
    this._company.getFloorimage(this.addnewSection.floorId).subscribe({

      next(data) {
        scopeThis.img = data;
        // scopeThis.imageval = scopeThis.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
        d3.select('#sectionImg').attr('href', URL.createObjectURL(data));
      }

    })
  }

  getSectionRow() {
    let scopeThis = this;
    this._company.getCompanySectionRow(this.sectionid).subscribe({
      next(data) {
        console.log(data);
        debugger;
        scopeThis.addnewSection = data;
      },
      error(msg) {
        if (msg == 401) {
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })
  }
  updateSectionRow() {
    let scopeThis = this;
    this._company.putCompanySectionRow(this.addnewSection).subscribe({
      next(data) {
        debugger;
        // scopeThis.addnewSection = data;
        scopeThis.addnewSection.id = scopeThis.sectionid;
        scopeThis._common.openSnackbar('Section row updated successfully');
        scopeThis.dialogRef.close();
      },
      error(msg) {
        if (msg == 401) {          
          scopeThis.dialogRef.close();
          scopeThis._common.openSnackbar('Session timedout, login again');
          scopeThis._router.navigate(['login']);
        }
      }
    })

  }

 
  // clickEvent(event) {
  //   this.redraw = true;
  //   debugger;
  //   var bbox = d3.select<SVGSVGElement, any>('#sectionImg').node().getBBox();
  //   var cReact = document.getElementById('sectionImg').getBoundingClientRect();
  //   let xFactor = bbox.width / cReact.width;
  //   let yFactor = bbox.height / cReact.height;
  //   var x = (event.clientX - cReact.left) * xFactor;
  //   var y = (event.clientY - cReact.top) * yFactor;

  //   var svg = d3.select('#drawArea');
  //   if (this.points.length > 0) {
  //     var line = svg.append("line")
  //       .style("stroke", "red")
  //       .attr("x1", this.points[this.points.length - 1][0])
  //       .attr("y1", this.points[this.points.length - 1][1])
  //       .attr("x2", x)
  //       .attr("y2", y)
  //       .attr("stroke-width", xFactor);

  //     var a = (this.points[0][0] - x) / xFactor;
  //     var b = (this.points[0][1] - y) / yFactor;
  //     var c = Math.sqrt(a * a + b * b);
  //     if (c < 5) {
  //       this.points.push(this.points[0]);
  //       this.createMap((this.points));
  //       this.addnewSection.mapCoords = JSON.stringify(this.points);
  //       this.points = [];
  //       this.isDrawComplete = true;
  //       document.getElementById("drawArea").removeEventListener('mousemove', this.moveEventRef);
  //       document.getElementById("drawArea").removeEventListener('click', this.clickEventRef);
  //     } else {
  //       this.points.push([x, y]);
  //     }
  //   } else {
  //     this.points.push([x, y]);
  //   }
  //   this.activeLine = this.activeLine ?
  //     this.activeLine
  //       .attr("x1", x)
  //       .attr("y1", y)
  //       .attr("x2", x)
  //       .attr("y2", y) :
  //     svg.append("line")
  //       .style("stroke", "red")
  //       .attr("x1", x)
  //       .attr("y1", y)
  //       .attr("x2", x)
  //       .attr("y2", y)
  //       .attr("stroke-width", xFactor);
  //   if (!this.isDrawComplete) {
  //     document.getElementById("drawArea").addEventListener('mousemove', this.moveEventRef);
  //   }

  // }

  // moveEvent(event) {
  //   var bbox = d3.select<SVGSVGElement, any>('#sectionImg').node().getBBox();
  //   var cReact = document.getElementById('sectionImg').getBoundingClientRect();
  //   let xFactor = bbox.width / cReact.width;
  //   let yFactor = bbox.height / cReact.height;
  //   var rect = event.target.getBoundingClientRect();
  //   var x = (event.clientX - rect.left) * xFactor; //x position within the element.
  //   var y = (event.clientY - rect.top) * yFactor;  //y position within the element.
  //   this.activeLine.attr("x2", x)
  //     .attr("y2", y);
  // }

  // onImageLoad() {
  //   debugger;
  //   document.getElementById("drawArea").addEventListener('click', this.clickeventRef);
  //   let img = new Image();
  //   img.src = d3.select("#sectionImg").attr('href');
  //   let pathPoints = JSON.parse(this.addnewSection.mapCoords ? this.addnewSection.mapCoords : null);
  //   let pathFunction = this.createMap;
  //   img.onload = function (event) {
  //     let loadedImage = (<HTMLInputElement>event.currentTarget);
  //     let width = loadedImage.width;
  //     let height = loadedImage.height;

  //     let svg = d3.select('#drawArea');
  //     svg.attr("viewBox", `0 0 ${width} ${height}`);

  //     if (pathPoints?.length > 0) {
  //       pathFunction(pathPoints);
  //     }
  //   }
  // }

  // private createMap(pathPoints: any) {
  //   var lineGenerator = d3.line();
  //   var pathString = lineGenerator(pathPoints);
  //   var svg = d3.select("#drawArea");
  //   var bbox = d3.select<SVGSVGElement, any>('#sectionImg').node().getBBox();
  //   var cReact = document.getElementById('sectionImg').getBoundingClientRect();
  //   let xFactor = bbox.width / cReact.width;
  //   var path = svg.append("path");
  //   path.attr('d', pathString)
  //     .attr('fill', 'darkkhaki')
  //     .style('opacity', 0.5)
  //     .style('stroke-width', xFactor)
  //     .style('stroke', 'red')
  //     .on('mouseover', function (d) {
  //       d3.select(this).style('opacity', '0.8');
  //     })
  //     .on('mouseout', function (d) {
  //       d3.select(this).style('opacity', '0.5');
  //     });
  //   return svg;
  // }

  // deleteSelectedShape() {
  //   d3.select("#drawArea").selectAll('line').remove();
  //   d3.select("#drawArea").selectAll('path').remove();
  //   this.points = [];
  //   this.activeLine = undefined;
  //   this.redraw = false;
  //   this.isDrawComplete = false;
  //   document.getElementById("drawArea").addEventListener('click', this.clickEventRef);
  //   // document.getElementById("drawArea").addEventListener('mousemove', this.moveEventRef);
  // }


  clickEvent(e) {
    this.redraw = true;
    var bbox = d3.select<SVGSVGElement, unknown>('#sectionImg').node().getBBox();
    var cReact = document.getElementById('sectionImg').getBoundingClientRect();
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
        this.addnewSection.mapCoords = JSON.stringify(this.points);
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
    var bbox = d3.select<SVGSVGElement, unknown>('#sectionImg').node().getBBox();
    var cReact = document.getElementById('sectionImg').getBoundingClientRect();
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
    var bbox = d3.select<SVGSVGElement, unknown>('#sectionImg').node().getBBox();
    var cReact = document.getElementById('sectionImg').getBoundingClientRect();
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
    img.src = d3.select('#sectionImg').attr('href');
    let pathPoints = JSON.parse(this.addnewSection.mapCoords ? this.addnewSection.mapCoords : null);
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
