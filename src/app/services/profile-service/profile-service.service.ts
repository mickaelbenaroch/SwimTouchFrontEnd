import { Injectable } from '@angular/core';
import { ProfileModel } from '../../models/ProfileModel';
import { HttpService } from '../http-service/http-service.service';
import { NotificationModel } from '../../models/NotificationModel';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {

  public profile: ProfileModel;
  public showNotificationPopup: boolean;
  public notifications: NotificationModel[] = [];
  
  constructor(public httpservice: HttpService) { }

  public GetProfile():void{
    var temp = localStorage.getItem("email");
    let model = {
      "user": temp
    }
    //this.spinerservice.start();
    this.httpservice.httpPost("profile/getProfile", model).subscribe(
      (res: any)=>{
        this.profile = res.data[0];
      },
      err =>{
        console.log(err);
      }
    )
  }
}
