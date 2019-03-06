import { Component, OnInit } from '@angular/core';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateTrainningComponent } from '../../dialog-boxes/create-trainning/create-trainning.component';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {

  //#region Public Members
  public trainnningModel: TrainningModel = new TrainningModel();
  public exerciceModel: ExerciseModel[] = [];
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
      data => console.log("Dialog output:", data)
  ); 
  }
  //#endregion
}
