import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http-service.service';
import { MatDialogRef } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-picture-update',
  templateUrl: './picture-update.component.html',
  styleUrls: ['./picture-update.component.scss']
})
export class PictureUpdateComponent implements OnInit {

  //#region Public Members
  public base64textString: string;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private spinnerservice: NgxUiLoaderService,
              private dialogRef: MatDialogRef<PictureUpdateComponent>) { }

  public ngOnInit():void {
  }
  //#endregion

  //#region Public Methods
   /**
    * Handle change select file input
    * @param event 
    */
  public handleFileSelect(event):void{
     //Reads the file bit by bit and save it into this.mp3 in base64 format 
     if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event1: any) => {
        this.base64textString = event1.target.result;
        console.log(this.base64textString);
        var model = {
          email: localStorage.getItem("email"),
          picture: this.base64textString
        };
        console.log("model ===>" + model.email)
        this.spinnerservice.start();
        this.httpservice.httpPost('login/upload', model).subscribe(
          res =>{
            this.spinnerservice.stop();
            console.log(res);
          },
          err =>{
            this.spinnerservice.stop();
            console.log(err);
          }
        )
      };
      reader.readAsDataURL(event.target.files[0]);
   }
  }

  /**
   * Close box
   */
  public Close():void{
    this.dialogRef.close();
  }
  //#endregion
}
