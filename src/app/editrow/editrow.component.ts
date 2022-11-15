import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../api/common/common.service';
import { EdittrolleyService } from '../api/edittrolley/edittrolley.service';
import { GetColorName } from 'hex-color-to-color-name';

@Component({
  selector: 'app-editrow',
  templateUrl: './editrow.component.html',
  styleUrls: ['./editrow.component.css']
})
export class EditrowComponent implements OnInit {

  getid: any;
  item: any;
  receiveid!: number
  qrimg:any;

  colorsList = ['red', 'pink', 'purple', 'SlateBlue', 'indigo', 'blue', 'navy', 'cyan', 'teal', 'green', 'YellowGreen', 'lime', 'yellow', 'gold', 'orange', 'orangered', 'brown', 'grey', 'SlateGrey']


  constructor(
    private route: ActivatedRoute,
    private _edittrolley: EdittrolleyService,
    private router: Router,
    private _common:CommonService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getid = Number(this.route.snapshot.paramMap.get('id'));
    debugger;
    this.editrowdetails(this.getid);
    // this.qrcodedisplay();
  }

  colorName:string = "";
  editrowdetails(requiredid: any) {
    this.spinner.show();
    debugger;
    let scopeThis = this;
    this._edittrolley.gettrolleybyidapi(requiredid).subscribe({
      next(data) {
        scopeThis.item = data;
        // console.log(scopeThis.item.qrCode);
        // scopeThis.colorName = GetColorName(scopeThis.item.trolleyColour);
        console.log(scopeThis.item)
        scopeThis.qrcodedisplay(requiredid);
        scopeThis.spinner.hide()
      },
      error(msg){
        if(msg==401){
          scopeThis._common.openSnackbar('Session Timed out, Re-Login again');
          scopeThis.router.navigate(['login'])
        }
      }
    })
  }

  qrcodedisplay(val:any){
    let scopeThis = this;
    debugger;
    this._edittrolley.getQRImageDetailsById(val).subscribe({
      next(data){
        scopeThis.qrimg = data;      
      }
    })

  }
  
  getcolorval(val:any){
    this.item.trolleyColour=val
    console.log(val);
  }

  saverow() {
    let scopeThis = this;
    debugger;
    this._edittrolley.putedittrolleyapi(this.item).subscribe({
      next(data) {
       
        console.log(data);
        scopeThis.router.navigate(['dashboard/addtrolley']);
      },
      error(msg){
        if(msg==401){
          scopeThis._common.openSnackbar('Session Timed out, Re-Login again');
          scopeThis.router.navigate(['login'])
        }
      }
    })
  }



}
