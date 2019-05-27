import { RoleEnum} from '../../enums/roleenum'
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { NotificationModel } from '../../models/NotificationModel';
import { NotificationTypeEnum } from '../../enums/notificationtypeenum'; 
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

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
              public httpservice: HttpService,
              public dialog: MatDialog) { }

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
                              if(this.profileservice.profile.type == RoleEnum.Swimmer && !noti.HasBeenreaded && noti.type == NotificationTypeEnum.Warning){
                                this.notifications.push(noti);
                                this.profileservice.showNotificationPopup = true;
                                this.profileservice.notifications = this.notifications;
                              }else if(this.profileservice.profile.type == RoleEnum.Swimmer && !noti.HasBeenreaded && noti.type == NotificationTypeEnum.Message){
                                this.OpenMessageBox(noti);
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

  //#region Public Methods
  /**
   * Open message box
   */
  public OpenMessageBox(notification: NotificationModel):void{
    const dialogConfig = new MatDialogConfig();
      
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: notification.title,
      body: notification.message,
      button: true,
      buttonText: "סמן כנקרא!"
    };
    dialogConfig.width = "507px";    
    dialogConfig.height = "314px";
    var ref = this.dialog.open(GenericDialogBoxComponent, dialogConfig);
    ref.afterClosed().subscribe(res =>{
      this.httpservice.httpPost('notification/updateNotification', {notification_id: notification._id}).subscribe(
        res =>{ console.log(res)},
        err =>{ console.log(err)}
      )
    })
    
  }
  //#endregion

}