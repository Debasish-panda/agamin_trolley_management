import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AddnewtrolleyService } from '../api/addnewtrolley/addnewtrolley.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Addnewtrolley } from '../models/addnewtrolley/addnewtrolley';
import { Router } from '@angular/router';
import { CommonService } from '../api/common/common.service';
import { ListoftrolleyService } from '../api/listoftrolley/listoftrolley.service';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { GetColorName } from 'hex-color-to-color-name';


@Component({
  selector: 'app-add-new-trolley',
  templateUrl: './trolley.html',
  styleUrls: ['./add-new-trolley.component.css']
})
export class AddNewTrolleyComponent implements OnInit {

  // trolleynumber = new FormControl('', [Validators.required]);
  // trolleycapacity = new FormControl('', [Validators.required]);
  // trolleyname = new FormControl('', [Validators.required]);
  // trolleytype = new FormControl('', [Validators.required]);
  // trolleycolor = new FormControl('', [Validators.required]);
  // department = new FormControl('', [Validators.required]);
  // bletagid = new FormControl('', [Validators.required]);
  // formFile = new FormControl('', [Validators.required]);

  addtrolley: FormGroup;
  submitted: boolean = false;

  addnewtrolley: Addnewtrolley = new Addnewtrolley();
  image!: File;
  public avatarURL: any;
  fileToUpload!: File;
  qrCodeid: number = 0;

  public toggle: boolean = false;

  colorsList = ['red', 'pink', 'purple', 'SlateBlue', 'indigo', 'blue', 'navy', 'cyan', 'teal', 'green', 'YellowGreen', 'lime', 'yellow', 'gold', 'orange', 'orangered', 'brown', 'grey', 'SlateGrey']
 
  colorName:string = "";
  constructor(
    private _addnewTrolleyService: AddnewtrolleyService,
    public fb: FormBuilder,
    private router: Router,
    private _listoftrolleyservice: ListoftrolleyService,
    private common: CommonService,
    public vcRef: ViewContainerRef, private cpService: ColorPickerService
  ) {
  }
  ngOnInit(): void {
    this.addtrolley = this.fb.group({
      trolleynumber: ['', Validators.required],
      trolleycapacity: ['', Validators.required],
      trolleyname: ['', Validators.required],
      trolleytype: ['', Validators.required],
      // trolleycolor: ['', Validators.required],
      department: ['', Validators.required],
      bletagid: ['', Validators.required],
      formFile: ['', Validators.required],
    })
  }
  get submitformControl() {
    return this.addtrolley.controls;
  }
  // getImage(files: any) {
  //   if (files.length=== 0) {
  //     return;
  //   }
  //   this.image = files[0];
  //   console.log(this.image);
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.image);
  //   reader.onload = (_event) => {
  //     this.avatarURL = reader.result;
  //     console.log(this.avatarURL);
  //   };
  //   console.log(this.avatarURL);
  // }

  public url: any;
  previewFile(event: any) {
    console.log('function argument : ' + event)
    debugger;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.url = reader.result;
        console.log(this.url);
      };
    }
    console.log('outside if inside function' + this.url)
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

  onSubmit(val: FormGroup) {
    console.log(val.value);
  }

 
  getcolorval(val:any){
    this.addnewtrolley.trolleyColour = val;
    console.log(val);
    this.colorName = GetColorName(val);
  }

  addNewTrolleyApi() {
    let scopeThis = this;
    this.submitted = true;
    // let pnum:number, psize:number;
    // debugger;
    // this._listoftrolleyservice.getlistoftrolleyapi("", pnum, psize).subscribe(data=>{
    //   let tableitem:any = data
    //   for(let i=0; i<tableitem.totalRecords; i++){
    //    console.log(tableitem.data[i].trolleyNumber);
    //   }
    // })
    if(this.addtrolley.valid){
      this._addnewTrolleyService.postaddnewTrolleyapi(this.addnewtrolley).subscribe(
        {
          next(data) {
            // debugger; 
            console.log(data);
            scopeThis.qrCodeid = data.id;
            if (scopeThis.fileToUpload) {
              // debugger;
              scopeThis._addnewTrolleyService.postimageapi(data.id, scopeThis.fileToUpload).subscribe({
                next(data) {
                  scopeThis.getQrCode();
                  scopeThis.router.navigate(['/dashboard/addtrolley']);
                  console.log(data);
  
                }, error(msg) {
                  if (msg == 401) {
                    scopeThis.common.openSnackbar('Session Expired Re-Login Again');
                    
                    scopeThis.router.navigate(['login']);
                  }
                }
              })
            }
          }, error(msg) {
            // debugger;
            // if (msg == 400) {
            //   scopeThis.common.openSnackbar('Enter all fields');
            // }
            if (msg == 401) {
              scopeThis.common.openSnackbar('Session Expired Re-Login Again');
              scopeThis.router.navigate(['login']);
            }
          }
        }
      )
    } else{
      this.common.openSnackbar('Enter all mandatory fields')
    }

   

  }

  qrimage: any;
  getQrCode() {
    let scopeThis = this;
    debugger;
    this._addnewTrolleyService.getQrCode(this.qrCodeid).subscribe({
      next(data) {
        debugger;
        scopeThis._addnewTrolleyService.getGenerateQeCodeImage(data.qrCode).subscribe({
          next(data) {
            scopeThis.qrimage = data;
          }
        })
      }
    })
  }



}
