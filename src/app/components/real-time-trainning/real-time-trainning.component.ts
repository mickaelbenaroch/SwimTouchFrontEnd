import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { RouteModel } from '../../models/RouteModel';
import { ExerciseModel } from '../../models/ExerciseModel';
import { OneTimeResult } from '../../models/OneTimeResult';
import { FinalResultModel } from '../../models/FinalResult';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RealTrainningEnum } from '../../enums/realtrainningenum';
import { OneJumpTimeResult } from '../../models/OneJumpTimeResult';
import { HttpService } from '../../services/http-service/http-service.service';
import { OneRouteFinalResultModel } from 'src/app/models/FinalOneRouteResultModel';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-real-time-trainning',
  templateUrl: './real-time-trainning.component.html',
  styleUrls: ['./real-time-trainning.component.scss']
})
export class RealTimeTrainningComponent implements OnInit {
  
   //#region Public Members
   public trainnings: TrainningModel[] = [];
   public stateHelper = RealTrainningEnum;
   public state: RealTrainningEnum = RealTrainningEnum.TrainningView;
   public choosenTrainning: TrainningModel;
   public choosenExercise: ExerciseModel;
   public temp: string[] = [];
   public r1counter: number = 0;
   public r2counter: number = 0;
   public r3counter: number = 0;
   public finalCounter1: number = 0;
   public finalCounter2: number = 0;
   public finalCounter3: number = 0;
   //#endregion
  
   //#region Constructor & Lifecycle Hooks
   constructor(private httpservice: HttpService,
               private dialog: MatDialog,
               private socket: Socket) { }
  
   public ngOnInit(): void { 
     var model = {
       coachmail: localStorage.getItem("email")
     }
     this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
       res =>{
         this.trainnings = res.trainning;
       },
       err =>{
         console.log(err);      }
     )
   }
   //#endregion
  
   //#region Public Methods
   /**
    * Choose a specific Exercise
    * @param trainning 
    */
   public ChooseExercise(exercise: ExerciseModel):void{
      console.log(exercise);
      this.choosenExercise = exercise;
      for(let i = 0; i<this.choosenExercise.howMuchTouches; i++)
        this.temp.push('temp');
      this.state = RealTrainningEnum.RealTimeView;
   }

   /**
    * Launch Start competiton
    * @param trainning 
    */
   public Start(exercise: ExerciseModel):void{
     var model = {
       action: "start",
       exercise_id: exercise.id
     }
     //Tells the broaker that the competition has been started
     this.socket.emit("action", model);

     //On every Touch on wall sensor, get the result from callback
     this.socket.on("WallSensor", (result:OneTimeResult) => {
      console.log(result);
      this.DivideResultsTouchTime(result);
    });

    //On every jump time get the result from callback
    this.socket.on("jumpTime", (result: OneJumpTimeResult) => {
      console.log(result);
      this.DivideResultsJumpTime(result);
    });
   }

    /**
    * Stop competiton
    * @param trainning 
    */
   public Stop(exercise: ExerciseModel):void{
    var model = {
      action: "stop",
      exercise_id: exercise.id
    }
    this.socket.emit("action",model)
    this.socket.on("stop-swim", (result: FinalResultModel) => {
      //send to db the result 
      console.log(result);
      this.DivideResultsFinalTime(result);
    });
  }

  /**
   * Repartition of results
   * @param trainning 
   */
  public DivideResultsJumpTime(result: OneJumpTimeResult):void{
    if(result !== undefined && result !== null){
      $("#jump"+result.route).text(result.jumpTime);
    }
  }

  /**
   * Repartition of results
   * @param trainning 
   */
  public DivideResultsTouchTime(result: OneTimeResult):void{
    if(result !== undefined && result !== null){
        switch(result.route){
              case "1":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r1counter.toString()).text(result.touchTime);      
                this.finalCounter1 += result.touchTime;
                if(this.finalCounter1 > 60){
                  this.finalCounter1 = this.finalCounter1/60;
                }
                this.finalCounter1 = Number(this.finalCounter1.toFixed(3));
                this.r1counter++;
              }
              break;
              case "2":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r2counter.toString()).text(result.touchTime);    
                this.finalCounter2 += result.touchTime;
                if(this.finalCounter2 > 60){
                  this.finalCounter2 = this.finalCounter2/60;
                }
                this.finalCounter2 = Number(this.finalCounter2.toFixed(3));
                this.r2counter++;
              }
              break; 
              case "3":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r3counter.toString()).text(result.touchTime);    
                this.finalCounter3 += result.touchTime;
                if(this.finalCounter3 > 60){
                  this.finalCounter3 = this.finalCounter3/60;
                }
                this.finalCounter3 = Number(this.finalCounter3.toFixed(3));
                this.r3counter++;
              }
              break;
            }
    }
  }

  /**
   * Repartition of results
   * @param trainning 
   */
  public DivideResultsFinalTime(result: any):void{
    if(result !== undefined && result !== null){
      for(var i = 0; i<this.choosenExercise.routes.routes.length;i++){
        if($("#final"+(i+1))){
          if(i == 0){
            if(this.finalCounter1 > 60){
              this.finalCounter1 = this.finalCounter1/60;
            }
            $("#final"+(i+1)).text(this.finalCounter1);
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.choosenExercise.date;
            resultToDb.jump_time = result.routes.route1.jump_time;
            resultToDb.results = result.routes.route1.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.choosenExercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.choosenExercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.choosenExercise.id;
            console.log("data 1st" +  resultToDb)
            this.SaverecordInDB(resultToDb);

          }else if(i == 1){
            if(this.finalCounter2 > 60){
              this.finalCounter2 = this.finalCounter2/60;
            }
            $("#final"+(i+1)).text(this.finalCounter2); 
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.choosenExercise.date;
            resultToDb.jump_time = result.routes.route2.jump_time;
            resultToDb.results = result.routes.route2.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.choosenExercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.choosenExercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.choosenExercise.id;
            console.log("data 2nd" + resultToDb)
            this.SaverecordInDB(resultToDb);

          }else if(i == 2){
            if(this.finalCounter3 > 60){
              this.finalCounter3 = this.finalCounter3/60;
            }
            $("#final"+(i+1)).text(this.finalCounter3);
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.choosenExercise.date;
            resultToDb.jump_time = result.routes.route3.jump_time;
            resultToDb.results = result.routes.route3.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.choosenExercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.choosenExercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.choosenExercise.id;
            console.log("data 3rd" + resultToDb)
            this.SaverecordInDB(resultToDb);

          }
        }
      }
    }
  }

   /**
    * Get the choosed trainning
    */ 
   public ChooseTrainning(trainning: TrainningModel){
     console.log(trainning);
     this.choosenTrainning = trainning;  
     this.state = RealTrainningEnum.ExerciseView;
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
   * Save record in db
   */
  public SaverecordInDB(model: OneRouteFinalResultModel):void{
    if(model !== undefined && model !== null){
      this.httpservice.httpPost('records/setrecords',model).subscribe(
        res =>{
          console.log(res);
        },
        err =>{
          console.log(err);
          this.OpenDialog();
        }
      )
    }else{
      this.OpenDialog();
      return;
    }
  }
   //#endregion
  
}
