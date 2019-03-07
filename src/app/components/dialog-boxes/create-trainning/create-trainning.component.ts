import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../services/http-service.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-create-trainning',
  templateUrl: './create-trainning.component.html',
  styleUrls: ['./create-trainning.component.scss']
})
export class CreateTrainningComponent implements OnInit {

  //#region Public Members
  @Input() name: string;
  public error: boolean;
  public exercise: ExerciseModel = new ExerciseModel();
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              private dialogRef: MatDialogRef<CreateTrainningComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialog: MatDialog,
              private ngxService: NgxUiLoaderService) { }

  public ngOnInit(): void{
    this.name = this.data.name;
    this.exercise.coach = localStorage.getItem("email");
  }
  //#endregion

  //#region Public Methods
   /**
   * Closes the dialog box
   */
  public Close(): void {
    this.dialogRef.close();
  }

  /**
   * Create Trainning 
   */
  public CreateTrainning():void{
    if(this.exercise.date == undefined || this.exercise == null ||
       this.exercise.distance == undefined || this.exercise.distance == null ||
       this.exercise.group == undefined || this.exercise.group == null ||
       this.exercise.style == undefined || this.exercise.style == null){
         this.error = true;
       }
    else{
      this.ngxService.start();
      this.httpservice.httpPost('exercise',this.exercise).subscribe(
        res =>{
          this.ngxService.stop();
          this.exercise.id = res.exercise_id;
          this.dialogRef.close(this.exercise);
        },
        err =>{
            this.ngxService.stop();
            this.OpenDialog();
        }
      )
    }   
  }

  /**
   * Disable Error
   */
  public DisableError():void{
    if(this.error){
      this.error = false;
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
      body: 'נא לנסות שוב!',
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}

  //#endregion

}
