import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { ExerciseModel } from '../../models/ExerciseModel';
import { OneTimeResult } from '../../models/OneTimeResult';
import { FinalResultModel } from '../../models/FinalResult';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RealTrainningEnum } from '../../enums/realtrainningenum';
import { OneJumpTimeResult } from '../../models/OneJumpTimeResult';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
        // var a = "#touch";
        // var b = this.choosenExercise.routes.routes[Number(result.route) -1].number;
        // var c = (Number(result.route) - 1).toString();
        // console.log(a +'***'+b+'***'+c);
        switch(result.route){
              case "1":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r1counter.toString()).text(result.touchTime);      
                this.finalCounter1 += result.touchTime;
                this.finalCounter1 = Number(this.finalCounter1.toFixed(3));
                this.r1counter++;
              }
              break;
              case "2":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r2counter.toString()).text(result.touchTime);    
                this.finalCounter2 += result.touchTime;
                this.finalCounter2 = Number(this.finalCounter2.toFixed(3));
                this.r2counter++;
              }
              break; 
              case "3":
              if(this.choosenExercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.choosenExercise.routes.routes[Number(result.route) -1].number + this.r3counter.toString()).text(result.touchTime);    
                this.finalCounter3 += result.touchTime;
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
  public DivideResultsFinalTime(result: FinalResultModel):void{
    if(result !== undefined && result !== null){
      for(var i = 0; i<this.choosenExercise.routes.routes.length;i++){
        if($("#final"+(i+1))){
          if(i == 0){
            $("#final"+(i+1)).text(this.finalCounter1);
          }else if(i == 1){
            $("#final"+(i+1)).text(this.finalCounter2);
          }else if(i == 2){
            $("#final"+(i+1)).text(this.finalCounter3);
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
   //#endregion
  
}
