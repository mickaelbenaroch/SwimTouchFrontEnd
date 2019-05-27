import { Injectable } from '@angular/core';
import { ProfileModel } from '../../models/ProfileModel';
import { HttpService } from '../http-service/http-service.service';
import { NotificationModel } from '../../models/NotificationModel';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
 
  //#region Public Members
  public profile: ProfileModel;
  public showNotificationPopup: boolean;
  public notifications: NotificationModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService) { }
  //#endregion

  //#region Public methods
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
        console.log(err);
      }
    )
  }
  //#endregion
}
