import { TeamModel } from '../../../models/TeamModel';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { TeamTargetModel } from '../../../models/TeamTargetModel';
import { HttpService } from 'src/app/services/http-service/http-service.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-add-team-target',
  templateUrl: './add-team-target.component.html',
  styleUrls: ['./add-team-target.component.scss']
})
export class AddTeamTargetComponent implements OnInit {

  //#region Public Members
  @Input() team: TeamModel;
  public target: TeamTargetModel = new TeamTargetModel();
  public styles: string[] = ['Freestyle','Backstroke','Breaststroke','Butterfly','Individual Medley'];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialog: MatDialog,
              private httpservice: HttpService,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<AddTeamTargetComponent>) { }

  public ngOnInit():void {
    this.team = this.data.team;
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
  public AddTeamTarget():void{
    this.target.team_id = this.team._id;
    this.target.date = new Date();
    this.httpservice.httpPost('target/teamtarget',this.target).subscribe(
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
    this.target.style = event.value;
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
    title: "היעד נוצר בהצלחה ל- " + this.team.name,
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
