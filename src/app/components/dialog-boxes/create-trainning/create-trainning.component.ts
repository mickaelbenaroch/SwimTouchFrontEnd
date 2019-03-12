import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TeamModel } from '../../../models/TeamModel';
import { RouteModel } from '../../../models/RouteModel';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { Component, OnInit, Inject, Input} from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service.service';
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
  @Input() team: TeamModel;
  public team_id: string;
  public error: boolean;
  public swimmers: string[] = [];
  public exercise: ExerciseModel = new ExerciseModel();
  public routes: string[] = ['1','2','3','4','5'];
  
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
    this.team_id = this.data.team;
    var model = {
      _id: this.team_id
    }
    this.httpservice.httpPost('team/getteams',model).subscribe(
      res =>{
        this.ngxService.stop();
        this.team = res.team[0];
        this.swimmers = this.team.swimmers;
        console.log("TEAM ==>" + this.team.swimmers)
      },
      err =>{
        this.ngxService.stop();
      }
    )
  }
  //#endregion

  //#region Public Methods

  /**
   * Fix number of touches in the exercise
   */
  public PoolDistance():void{
    this.DisableError();
    if(this.exercise.howMuchTouches !== undefined && this.exercise.howMuchTouches >0){
      this.exercise.howMuchTouches = Number(this.exercise.distance) / this.exercise.howMuchTouches;
    }
  }

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
       this.exercise.style == undefined || this.exercise.style == null ||
       this.exercise.routes.routes == undefined || this.exercise.howMuchTouches == 0 || 
       this.exercise.howMuchTouches == undefined){
         this.error = true;
       }
    else{
      console.log(this.exercise)
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
   * On Mat select change handler
   */
  public Select(event):void{debugger;
      var temp = event.source.id.split('t');
      var selectNumber = temp[1];
      let route1 = new RouteModel();
      route1.number = event.value;
      route1.swimmer_ref = $("#swimmer" + selectNumber)[0].textContent;
      this.exercise.routes.routes.push(route1);
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
