import { Component, OnInit, Input } from '@angular/core';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { NotificationModel } from '../../models/NotificationModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  //#region Public Members
  @Input() notifications: NotificationModel[] = [];
  public notificationsToPresent: NotificationModel[] = [];
  //#endregion

  //#region Constructor && Lifecycle Hooks
  public constructor( private dialog: MatDialog,
                      public httpservice: HttpService,
                      public profileservice: ProfileServiceService) { }

  public ngOnInit():void {
    this.notifications.forEach(not =>{
      if(not.HasBeenreaded){
        this.notificationsToPresent.push(not);
      }
    })
  }
  //#endregion

  //#region Public Methods

  /**
   * Close the notification box
   */
  public Close():void{
    this.notifications.forEach(not =>{
      let model = {
        notification_id: not._id
      }
      this.httpservice.httpPost('notification/updateNotification', model).subscribe(
        res =>{
          console.log(res);
          this.profileservice.showNotificationPopup = false;
        },
        err =>{
          this.OpenDialog();
        }
      )  
    })
  }

    /**
  * Error dialog Box Opening
  * @param email 
  */
 public OpenDialog() {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title: 'נראה שמשהו השתבש בדרך...',
    body: 'נא לנסות מאוחר יותר',
    button: true,
    buttonText: "הבנתי!"
  };
  dialogConfig.width = "420px";
  dialogConfig.height = "250px";
  this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}
  //#endregion

}
