import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HttpService } from '../../../services/http-service/http-service.service';
import { CreateTrainningComponent } from '../../dialog-boxes/create-trainning/create-trainning.component';
import { GenericDialogBoxComponent } from '../../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddTeamToTrainningComponent } from '../../dialog-boxes/add-team-to-trainning/add-team-to-trainning.component';
import { noUndefined } from '@angular/compiler/src/util';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {

  //#region Public Members
  public trainnningModel: TrainningModel = new TrainningModel();
  public exerciceModel: ExerciseModel[] = [];
  public error: boolean;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor( private dialog: MatDialog,
               private httpservice: HttpService,
               private spinnerservice: NgxUiLoaderService) { }

  public ngOnInit(): void {
    this.trainnningModel.coachmail = localStorage.getItem("email");
  
  }
  //#endregion

  //#region Public Methods
  /**
   * Open create trainning dialog box
   */
  public OpenCreateBox():void{
    if(this.error){
      this.error = false;
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      name: this.trainnningModel.name,
    };
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    var dialogRef = this.dialog.open(CreateTrainningComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (data: ExerciseModel) => {
        if(data !== undefined){
          console.log("Dialog output:", data);
          this.trainnningModel.exercises.push(data);
          this.exerciceModel.push(data);
        }
      }
  ); 
  }

  /**
   * Save Trainning
   */
  public SaveTrainning():void{
    if(this.trainnningModel.coachmail !== undefined && this.trainnningModel.coachmail !== null &&
       this.trainnningModel.name !== undefined && this.trainnningModel.name !== null &&
       this.trainnningModel.team_id !== undefined && this.trainnningModel.team_id !== null){
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
          this.httpservice.httpPost('trainning',this.trainnningModel).subscribe(
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
 * Open Addd swimmers box
 */
public OpenAddTeamBox():void{
      setTimeout(()=>{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          coachmail: this.trainnningModel.coachmail,
          team: this.trainnningModel.team_id
        };
        dialogConfig.width = "600px";
        dialogConfig.height = "600px";
        var dialogRef = this.dialog.open(AddTeamToTrainningComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          res => {
            this.trainnningModel.team_id = res;
          }
        );
      },100)
}
 
/**
 * Open Succes box dialog
 */
public OpenSuccesDialogBox():void{
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title:   ' האימון ' + this.trainnningModel.name + ' נשמר בהצלחה ',
      body: 'באפשרותך לערוך אותו בכל רגע ',
      button: true,
      buttonText: "הבנתי!"
    };

    dialogConfig.width = "560px";
    dialogConfig.height = "272px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}
  //#endregion
}
