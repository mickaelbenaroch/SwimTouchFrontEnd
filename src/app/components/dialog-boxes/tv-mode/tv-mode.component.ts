import { Socket } from 'ngx-socket-io';
import { RouteModel } from '../../../models/RouteModel';
import { OneTimeResult } from '../../../models/OneTimeResult';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { FinalResultModel } from '../../../models/FinalResult';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { OneJumpTimeResult } from '../../../models/OneJumpTimeResult';
import { HttpService } from '../../../services/http-service/http-service.service';
import { OneRouteFinalResultModel } from '../../../models/FinalOneRouteResultModel';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-tv-mode',
  templateUrl: './tv-mode.component.html',
  styleUrls: ['./tv-mode.component.scss']
})
export class TvModeComponent implements OnInit {

  //#region Public Members
  @Input() exercise: ExerciseModel;
  @Input() swimmers: string[] = [];
  public finalResultModel: FinalResultModel = new FinalResultModel();
  public r1counter: number = 0;
  public r2counter: number = 0;
  public r3counter: number = 0;
  public finalCounter1: number = 0;
  public finalCounter2: number = 0;
  public finalCounter3: number = 0;
  public milli: string = '00';
  public seconds: string = '00';
  public minutes: string = '00';
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              private dialogRef: MatDialogRef<TvModeComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialog: MatDialog,
              private socket: Socket) { }

  public ngOnInit():void {
    this.exercise = this.data.exercise;
    this.swimmers = this.data.swimmers;
    $(".tv-dialog").css('max-width','unset');
  }
  //#endregion
  
  //#region Public Methods
   /**
    * Launch Start competiton
    * @param trainning 
    */
   public Start(exercise: ExerciseModel):void{
     this.StartTimer();
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
     this.finalResultModel = result;
     this.DivideResultsFinalTime(result); 
   });
 }


  /**
   * Close the box
   */
  public Close():void{
    this.dialogRef.close(this.finalResultModel);
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
              if(this.exercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.exercise.routes.routes[Number(result.route) -1].number + this.r1counter.toString()).text(result.touchTime);      
                this.finalCounter1 += result.touchTime;
                if(this.finalCounter1 > 60){
                  this.finalCounter1 = this.finalCounter1/60;
                }
                this.finalCounter1 = Number(this.finalCounter1.toFixed(3));
                this.r1counter++;
              }
              break;
              case "2":
              if(this.exercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.exercise.routes.routes[Number(result.route) -1].number + this.r2counter.toString()).text(result.touchTime);    
                this.finalCounter2 += result.touchTime;
                if(this.finalCounter2 > 60){
                  this.finalCounter2 = this.finalCounter2/60;
                }
                this.finalCounter2 = Number(this.finalCounter2.toFixed(3));
                this.r2counter++;
              }
              break; 
              case "3":
              if(this.exercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.exercise.routes.routes[Number(result.route) -1].number + this.r3counter.toString()).text(result.touchTime);    
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
      for(var i = 0; i<this.exercise.routes.routes.length;i++){
        if($("#final"+(i+1))){
          if(i == 0){
            if(this.finalCounter1 > 60){
              this.finalCounter1 = this.finalCounter1/60;
            }
            $("#final"+(i+1)).text(this.finalCounter1);
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route1.jump_time;
            resultToDb.results = result.routes.route1.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 1st" +  resultToDb)
            this.SaverecordInDB(resultToDb);

          }else if(i == 1){
            if(this.finalCounter2 > 60){
              this.finalCounter2 = this.finalCounter2/60;
            }
            $("#final"+(i+1)).text(this.finalCounter2); 
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route2.jump_time;
            resultToDb.results = result.routes.route2.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 2nd" + resultToDb)
            this.SaverecordInDB(resultToDb);

          }else if(i == 2){
            if(this.finalCounter3 > 60){
              this.finalCounter3 = this.finalCounter3/60;
            }
            $("#final"+(i+1)).text(this.finalCounter3);
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route3.jump_time;
            resultToDb.results = result.routes.route3.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 3rd" + resultToDb)
            this.SaverecordInDB(resultToDb);

          }
        }
      }
    }
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
 * Timer
 */
public StartTimer():void{
  var mil = 0; var sec = 0; var min = 0;
  setInterval(()=>{
    mil += 100;
    if(mil == 1000){
      mil = 0
      sec +=1;
      if(sec == 60){
        sec = 0;
        min +=1;
      }
    }
    this.milli = mil.toString();
    this.seconds = sec.toString(); 
    this.minutes = min.toString();
  },10)
}
  //#endregion

}
