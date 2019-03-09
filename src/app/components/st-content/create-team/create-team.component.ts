import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HttpService } from 'src/app/services/http-service.service';
import { SwimmerModel } from '../../../models/SwimmerModel';
import { TeamModel } from '../../../models/TeamModel';
import {CreateTeamBoxComponent } from '../../dialog-boxes/create-team/create-team.component';
import { GenericDialogBoxComponent } from '../../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {

//#region Public Members
public teamModel: TeamModel = new TeamModel();
public swimmersModel: SwimmerModel[] = [];
public error: boolean;
//#endregion

//#region Constructor & Lifecycle Hooks
constructor( private dialog: MatDialog,
             private httpservice: HttpService,
             private spinnerservice: NgxUiLoaderService) { }

public ngOnInit(): void {
  this.teamModel.coachmail = localStorage.getItem("email");

}
//#endregion

//#region Public Methods
/**
 * Open create trainning dialog box
 */
public OpenCreateBox(edit: string = null):void{
  if(this.error){
    this.error = false;
  }
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    name: this.teamModel.name,
    edit: edit,
    coachmail: this.teamModel.coachmail
  };
  dialogConfig.width = "600px";
  dialogConfig.height = "600px";
  var dialogRef = this.dialog.open(CreateTeamBoxComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(
    (data: SwimmerModel) => {
      if(data !== undefined){
        console.log("Dialog output:", data);
        this.teamModel.swimmers.push(data._id);
        this.swimmersModel.push(data);
      }
    }
); 
}

/**
 * Save Trainning
 */
public SaveTrainning():void{
  if(this.teamModel.coachmail !== undefined && this.teamModel.coachmail !== null &&
     this.teamModel.name !== undefined && this.teamModel.name !== null){
       this.OpenSureToSaveBox();
     }else{
       this.error = true;
     }

}

/**
 * Disable Error on input change
 */
public DisableError():void{
  if(this.error){
    this.error = false;
  }
}

/**
* Open generic box Sure To Save trainning?
*/
public OpenSureToSaveBox():void{
const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title: 'האם הינך בטוח לשמור את האימון?',
    body: 'אם כן, לחץ על שמור, אחרת לחץ על X',
    button: true,
    buttonText: "שמור",
    cancel: true
  };
  dialogConfig.width = "500px";
  dialogConfig.height = "250px";
  var dialogRef = this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(
    (res:string)=>{
      if(res !== null && res!== undefined && res == "ok"){
        this.spinnerservice.start();
        this.httpservice.httpPost('team',this.teamModel).subscribe(
          res =>{
            this.spinnerservice.stop();
            this.OpenSuccesDialogBox();
            console.log(res);
          },
          err =>{
            this.spinnerservice.stop();
            this.OpenDialog();
          }
        )
      }
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
    body: 'הפרטים שהוזנו אינם נכונים, נסה שוב!',
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
    title:   ' הקבוצה ' + this.teamModel.name + ' נשמרה בהצלחה ',
    body: 'באפשרותך לערוך אותה בכל רגע ',
    button: true,
    buttonText: "הבנתי!"
  };

  dialogConfig.width = "560px";
  dialogConfig.height = "272px";
  this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}
//#endregion
}
