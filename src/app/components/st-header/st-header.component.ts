import { PageEnum } from 'src/app/enums/componentview';
import { ProfileModel } from '../../models/ProfileModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http-service.service';
import { PictureUpdateComponent } from '../dialog-boxes/picture-update/picture-update.component';

@Component({
  selector: 'app-st-header',
  templateUrl: './st-header.component.html',
  styleUrls: ['./st-header.component.scss']
})
export class StHeaderComponent implements OnInit {

  //#region Public Members 
  @Input() title: string;
  @Input() profile: ProfileModel;
  @Output() HomeEvent: EventEmitter<PageEnum> = new EventEmitter();
  public base64textString: string;
  //#endregion

  //#region Constructor & Lifecycle Hooks 
  constructor(private dialog: MatDialog,
              private httpservice: HttpService) { }

  public  ngOnInit():void {
  }
  //#endregion

  //#region Public Methods 

   /**
   * Error dialog Box Opening
   * @param email 
   */
  public OpenDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    var dialogRef = this.dialog.open(PictureUpdateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res =>{
      this.GetProfile();
    })
}

  /**
   * Get profile of trainer
   */
  public GetProfile():void{
    var temp = localStorage.getItem("email");
    let model = {
      "user": temp
    }
    this.httpservice.httpPost("profile/getProfile", model).subscribe(
      (res: any)=>{
        this.profile = res.data[0];
      },
      err =>{
        console.log(err);      }
    )
  }

 /**
   * Event click handler
   */
  public Click():void{
      this.HomeEvent.emit(PageEnum.Landing);
  }
  //#endregion

}
