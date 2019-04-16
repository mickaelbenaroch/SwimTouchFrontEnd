import { SwimmerModel } from '../../../models/SwimmerModel';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { SwimmingStylesEnum } from '../../../enums/swimmingstylesenum';
import { SwimmerTargetModel } from '../../../models/SwimmerTargetModel';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material';
import { HttpService } from '../../../services/http-service/http-service.service';
import { AddTeamToTrainningComponent } from '../add-team-to-trainning/add-team-to-trainning.component';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-add-swimmer-target',
  templateUrl: './add-swimmer-target.component.html',
  styleUrls: ['./add-swimmer-target.component.scss']
})
export class AddSwimmerTargetComponent implements OnInit {

  //#region Public Members
  @Input() swimmer: SwimmerModel;
  public target: SwimmerTargetModel = new SwimmerTargetModel();
  public styles: string[] = ["חתירה","גב","פרפר","חזה","חופשי","מעורב","שליחים","כפות","סנפירים","משקלים","צפרדע","שחיית-צד","אחר"];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialog: MatDialog,
              private httpservice: HttpService,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<AddSwimmerTargetComponent>) { }

  public ngOnInit():void {
    this.swimmer = this.data.swimmer;
  }
  //#endregion

  //#region Public Methods
  /**
   * CLose the dialog box
   */
  public Close():void{
    this.dialogRef.close();
  }

  /**
   * AddSwimmerTarget
   */
  public AddSwimmerTarget():void{debugger;
    this.target.Swimmer_ref = this.swimmer._id;
    this.httpservice.httpPost('target/swimmertarget',this.target).subscribe(
      res=>{
        console.log(res);
        this.OpenSuccesDialogBox();
      },
      err =>{
        this.OpenDialog();
      }
    )
  }

  /**
   * On Select stule change
   */
  public Select(event):void{
    switch(event.value){
      case "חתירה":
      this.target.Style = SwimmingStylesEnum.Crawl;
      break;
      case "גב":
      this.target.Style = SwimmingStylesEnum.Back;
      break;
      case "פרפר":
      this.target.Style = SwimmingStylesEnum.Butterfly;
      break;
      case "חזה":
      this.target.Style = SwimmingStylesEnum.Belly;
      break;
      case "חופשי":
      this.target.Style = SwimmingStylesEnum.Free;
      break;
      case "מעורב":
      this.target.Style = SwimmingStylesEnum.Mix;
      break;
      case "שליחים":
      this.target.Style = SwimmingStylesEnum.Delivery;
      break;
      case "כפות":
      this.target.Style = SwimmingStylesEnum.Palms;
      break;
      case "סנפירים":
      this.target.Style = SwimmingStylesEnum.Snapirims;
      break;
      case "משקלים":
      this.target.Style = SwimmingStylesEnum.Weights;
      break;
      case "צפרדע":
      this.target.Style = SwimmingStylesEnum.Frog;
      break;
      case "שחיית-צד":
      this.target.Style = SwimmingStylesEnum.Side;
      break;
      case "אחר":
      this.target.Style = SwimmingStylesEnum.Other;
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

/**
 * Open Succes box dialog
 */
public OpenSuccesDialogBox():void{
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title: "היעד נוצר בהצלחה ל- " + this.swimmer.name,
    body: 'באפשרותך לערוך אותו בכל רגע ',
    button: true,
    buttonText: "הבנתי!"
  };

  dialogConfig.width = "560px";
  dialogConfig.height = "272px";
  var ref = this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  ref.afterClosed().subscribe(res => {
    this.dialogRef.close(this.target);
  })
  
}
  //#endregion

}
