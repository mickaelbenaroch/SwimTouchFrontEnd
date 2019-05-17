import { TeamModel } from '../../../models/TeamModel';
import { RouteModel } from '../../../models/RouteModel';
import { SwimmerModel } from '../../../models/SwimmerModel';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { Component, OnInit, Inject, Input} from '@angular/core';
import { ExerciseTypeEnum } from '../../../enums/exercisetypeenum';
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
  @Input() date: string;
  public team_id: string; 
  public error: boolean;
  public calculated: boolean;
  public swimmers: SwimmerModel[] = [];
  public exercise: ExerciseModel = new ExerciseModel();
  public routes: string[] = ['1','2','3','4','5'];
  public groups: string[] = ['A','B','C','D'];
  public styles: string[] = ['Freestyle','Backstroke','Breaststroke','Butterfly','Individual Medley'];
  public pooldistance: number = 25;
  public categories: string[] = ['Warm Up','Build Up','Core - Main Set', 'Warm Down']
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              private dialogRef: MatDialogRef<CreateTrainningComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialog: MatDialog) { }

  public ngOnInit(): void{
    this.name = this.data.name;
    this.date = this.data.date;
    this.exercise.coach = localStorage.getItem("email");
    this.team_id = this.data.team;
    var model = {
      _id: this.team_id
    }
    this.httpservice.httpPost("team/getteams",{}).subscribe(
      (res: any )=>{
        this.team = res.team.forEach(team => {
          if(team._id == this.team_id){
            this.team = team;
            this.swimmers = team.swimmers;
            this.Select();
          }
        });
      },
      err =>{
        console.log(err);      
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
    //if(this.exercise.howMuchTouches !== undefined && this.exercise.howMuchTouches >0){
     // this.calculated = true;
     if(this.exercise.distance !== undefined){
      this.exercise.singleSwimDistance = this.exercise.distance; 
      this.exercise.distance = this.exercise.distance * this.exercise.repeat;
       this.exercise.howMuchTouches = Number(this.exercise.distance) / this.pooldistance;
     }
    //}
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
    this.exercise.date = new Date(this.date);
    this.PoolDistance();
    if(this.exercise.repeat == undefined || this.exercise.repeat == null ||
       this.exercise.type == undefined || this.exercise.type == null ||
       this.exercise.date == undefined || this.exercise == null ||
       this.exercise.distance == undefined || this.exercise.distance == null ||
       this.exercise.group == undefined || this.exercise.group == null ||
       this.exercise.style == undefined || this.exercise.style == null ||
       this.exercise.routes.routes == undefined || this.exercise.howMuchTouches == 0 || 
       this.exercise.howMuchTouches == undefined){
         this.error = true;
       }
    else{
        console.log(this.exercise)
        this.httpservice.httpPost('exercise',this.exercise).subscribe(
          res =>{
            this.exercise.id = res.exercise_id;
            this.dialogRef.close(this.exercise);
          },
          err =>{
            console.log(err);
            this.OpenDialog();
          }
        )
    }   
  }

  /**
   * On Mat select change handler
   */
  public Select():void{
    for(var i = 0; i<this.swimmers.length; i++){
      let route1 = new RouteModel();
      route1.number = i;
      route1.swimmer_ref = this.swimmers[i].name;
      var model = {
        name: route1.swimmer_ref
      }
      this.httpservice.httpPost('swimmer/getswimmers',model).subscribe(
        (res: any) =>{
          route1.swimmer_id = res.swimmer[0]._id;
          this.exercise.routes.routes.push(route1);
        },
        err =>{
          console.log(err);
          this.OpenDialog()        
        }
      )
    }
  }

  /**
   * On group selection change
   */
  public SelectGroup(event):void{
      this.DisableError();
      console.log(event);
      this.exercise.group = event.value;
  }

    /**
   * On Category selection change
   */
  public SelectCategory(event):void{
    this.DisableError();
    console.log(event);
    switch(event.value){
      case "Warm Up":
      this.exercise.type = ExerciseTypeEnum.WarmUp;
      break;
      case "Build Up":
      this.exercise.type = ExerciseTypeEnum.BuildUp;
      break;
      case "Core - Main Set":
      this.exercise.type = ExerciseTypeEnum.Core;
      break;
      case "Warm Down":
      this.exercise.type = ExerciseTypeEnum.WarmDown;
      break;
    }
}

  /**
   * On Style selection change
   */
  public SelectStyle(event):void{
    this.DisableError();
    console.log(event);
    this.exercise.style = event.value;
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
