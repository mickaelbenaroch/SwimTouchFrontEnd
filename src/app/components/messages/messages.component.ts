import { Component, OnInit, Input } from '@angular/core';
import { MailModel } from '../../models/MailModel';
import { ProfileModel } from '../../models/ProfileModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  //#region Public Members
  @Input()  mails: MailModel[] = [];
  @Input() profiles: ProfileModel[] = [];
  public newMailPressed: boolean;
  public mailToSend: MailModel = new MailModel();
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              public dialog: MatDialog) { }

  public ngOnInit(): void {

  }
  //#endregion

  //#region Public Methods
  /**
   * newMail
   */
  public newMail():void{
    this.newMailPressed = true;
  }

  /**
   * on Select change
   */
  public Select(eve):void{
    this.mailToSend.receiver = eve.value.user;
  }

  /**
   * Send mail
   */
  public SendMail():void{
    this.mailToSend.sender = localStorage.getItem("email");
    if(this.mailToSend.body == undefined || this.mailToSend.title == undefined || this.mailToSend.sender == undefined || this.mailToSend.receiver == undefined){
      var message = "אחד השדות ריק";
      this.OpenSimpleMessageBox(message);
      return;
    }else{
      this.httpservice.httpPost('mails/setMail', this.mailToSend).subscribe(
        res =>{
          this.newMailPressed = false;
          this.OpenSimpleMessageBox2("ההודעה נשלחה בהצלחה");
        }
      )
    }
  }

   /**
   * Open Dialog error box
   */
  public OpenSimpleMessageBox(message: string):void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'שגיאה!',
      body: message,
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  }

     /**
   * Open Dialog error box
   */
  public OpenSimpleMessageBox2(message: string):void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'הודעה!',
      body: message,
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  }
  //#endregion

}
