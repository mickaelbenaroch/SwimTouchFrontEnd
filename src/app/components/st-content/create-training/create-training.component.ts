import { Component, OnInit } from '@angular/core';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateTrainningComponent } from '../../dialog-boxes/create-trainning/create-trainning.component';
import { GenericDialogBoxComponent } from '../../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

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
  constructor( private dialog: MatDialog,) { }

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
          this.trainnningModel.exercises.push(data.id);
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
       this.trainnningModel.name !== undefined && this.trainnningModel.name !== null){
         this.OpenSureToSaveBox();
        //send trainnig to server to be created

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
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}
  //#endregion
}
