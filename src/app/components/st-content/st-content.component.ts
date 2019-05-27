import { RoleEnum } from '../../enums/roleenum';
import { PageEnum } from '../../enums/componentview';
import { HttpService } from '../../services/http-service/http-service.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-st-content',
  templateUrl: './st-content.component.html',
  styleUrls: ['./st-content.component.scss']
})
export class StContentComponent implements OnInit, OnChanges {

  //#region Public Members
  public pageenum: PageEnum = PageEnum.Landing;
  public state = PageEnum;
  public role = RoleEnum;
  @Input() stateFromFather: boolean;
  @Input() eventFromSideNav: PageEnum;
  @Input() stateChange: PageEnum;
  
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor( public dialog: MatDialog,
               public httpservice: HttpService,
               public profileservice: ProfileServiceService) { }

  public ngOnInit():void {
    if(this.profileservice.profile !== undefined && this.profileservice.profile.user == RoleEnum.Swimmer){
      let swimmerName = {
        name: this.profileservice.profile.first_name + ' ' + this.profileservice.profile.last_name
      }
      this.httpservice.httpPost('swimmer/getswimmers',swimmerName).subscribe(
        res =>{
            let idOfSwimmer = {
              swimmer_id: res.swimmer[0]._id
            }
            this.httpservice.httpPost('notification/getNotification', {swimmer_id: idOfSwimmer}).subscribe(
              res =>{
                console.log(res);
              },
              err =>{
                this.OpenDialog();
              }
            )
        },
        err =>{
          this.OpenDialog();
        }
      )
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(this.stateFromFather ){
      this.pageenum = PageEnum.Landing
    }
    if(this.eventFromSideNav){
      this.pageenum = this.eventFromSideNav;
    }
    if(this.stateChange !== undefined){
      this.pageenum = this.stateChange;
    }
  } 
  //#endregion

  //#region Public Methods
    /**
   * Goes to main page
   * @param event 
   */
  public LandToMainPage(event: PageEnum):void{
    if(event == PageEnum.Landing){
      this.pageenum = PageEnum.Landing;
    }
  }
  
  /**
   * GoToCalender
   * @param event 
   */
  public GoToCalender(event):void{
    this.pageenum = PageEnum.MyTrainnings;
  }

  /* GoToSwimmers
  * @param event 
  */
 public GoToSwimmers(event):void{
   this.pageenum = PageEnum.MySwimmers;
 }

   /* GoToSwimmers
  * @param event 
  */
 public GoToStats(event):void{
  this.pageenum = PageEnum.MyMatalots;
}

  /**
   * Create New Event
   */
  public CreateNewTrainningEvent(event: PageEnum){
      switch(event){
        case PageEnum.Landing:
        this.pageenum = PageEnum.Landing;
        break;
        case PageEnum.CreateTraining:
        this.pageenum = PageEnum.CreateTraining;
        break;
        case PageEnum.CreateSwimmer:
        this.pageenum = PageEnum.CreateSwimmer;
        break;
        default:
        this.pageenum = PageEnum.Landing;
        break;
      }
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
