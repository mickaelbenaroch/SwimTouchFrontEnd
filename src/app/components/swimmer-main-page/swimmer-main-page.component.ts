import { RoleEnum} from '../../enums/roleenum'
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { NotificationModel } from '../../models/NotificationModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';

@Component({
  selector: 'app-swimmer-main-page',
  templateUrl: './swimmer-main-page.component.html',
  styleUrls: ['./swimmer-main-page.component.scss']
})
export class SwimmerMainPageComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  public notifications: NotificationModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public profileservice: ProfileServiceService,
              public httpservice: HttpService) { }
  //#endregion

  //#region Public Methods
  public ngOnInit():void {
    var temp = localStorage.getItem("email");
    let model = {
      "user": temp
    }
    this.httpservice.httpPost("profile/getProfile", model).subscribe(
      (res: any)=>{
        this.httpservice.httpPost('swimmer/getswimmers',{name: res.data[0].first_name + ' ' + res.data[0].last_name}).subscribe(
          res=>{
            let idOfSwimmer = {
              swimmer_id: res.swimmer[0]._id
            }
            this.httpservice.httpPost('notification/getNotification', idOfSwimmer).subscribe(
              res =>{
                res.data.forEach(noti =>{
                  if(this.profileservice.profile.type == RoleEnum.Swimmer && noti.HasBeenreaded){
                    this.notifications.push(noti);
                    this.profileservice.showNotificationPopup = true;
                    this.profileservice.notifications = this.notifications;
                  }
                })
              },
              err =>{
                console.log(res);
              }
            )
           this.httpservice.httpPost('team/getSwimmerTeams',{swimmer_id: res.swimmer[0]._id}).subscribe(
             res =>{
               this.teams = res.teams;
             }
           )
          },
          err =>{
            console.log(err);
          }
        )
      },
      err =>{
        console.log(err);
      }
    )
  }
  //#endregion

}