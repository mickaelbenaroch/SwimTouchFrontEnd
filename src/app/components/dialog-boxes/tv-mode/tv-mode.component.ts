import { Socket } from 'ngx-socket-io';
import { RouteModel } from '../../../models/RouteModel';
import { OneTimeResult } from '../../../models/OneTimeResult';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { FinalResultModel } from '../../../models/FinalResult';
import { TrainningModel } from '../../../models/TrainningModel';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { OneJumpTimeResult } from '../../../models/OneJumpTimeResult';
import { NotificationModel } from '../../../models/NotificationModel';
import { NotificationTypeEnum } from '../../../enums/notificationtypeenum'
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
  @Input() trainning: TrainningModel;
  @Input() swimmers: string[] = [];
  public finalResultModel: FinalResultModel = new FinalResultModel();
  public r1counter: number = 0;
  public r2counter: number = 0;
  public r3counter: number = 0;
  public finalCounter: number = 0;
  public milli: string = '00';
  public seconds: string = '00';
  public minutes: string = '00';
  public finalArrayResults: OneRouteFinalResultModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              private dialogRef: MatDialogRef<TvModeComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialog: MatDialog,
              private socket: Socket) { }

  public ngOnInit():void {
    this.socket.connect();

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

       this.socket.on("stop-swim", (result: FinalResultModel) => {
         setTimeout(()=>{
          //send to db the result 
          console.log(result);
          this.finalCounter +=1;
          if(this.finalCounter == 1){
            console.log("save")
            this.finalResultModel = result;
            this.DivideResultsFinalTime(result); 
          }
        },5000)
      });

    this.exercise = this.data.exercise;
    this.swimmers = this.data.swimmers;
    this.trainning = this.data.trainning;
    $(".tv-dialog").css('max-width','unset');
    this.exercise.routes.routes.sort((a, b) => a.number - b.number);
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
     setTimeout(()=>{
         console.log(result);
         this.finalCounter +=1;
         if(this.finalCounter == 1){
           console.log("save")
           this.finalResultModel = result;
           this.DivideResultsFinalTime(result); 
         }
       },5000);
     })
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
                this.r1counter++;
              }
              break;
              case "2":
              if(this.exercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.exercise.routes.routes[Number(result.route) -1].number + this.r2counter.toString()).text(result.touchTime);    
                this.r2counter++;
              }
              break; 
              case "3":
              if(this.exercise.routes.routes[Number(result.route) -1] !== undefined){
                $("#touch"+ this.exercise.routes.routes[Number(result.route) -1].number + this.r3counter.toString()).text(result.touchTime);    
                this.r3counter++;
              }
              break;
            }
            //if all the times arrived, stop the exercise
            if(this.exercise.routes.routes.length == 1 && this.r1counter == this.exercise.howMuchTouches){
              console.log("stop1");
              this.Stop(this.exercise);
            }
            if(this.exercise.routes.routes.length == 2 && this.r1counter == this.r2counter && this.r1counter == this.exercise.howMuchTouches){
              console.log("stop2");
              this.Stop(this.exercise);
            }
            if(this.exercise.routes.routes.length == 3 && this.r1counter == this.r2counter && this.r1counter == this.r3counter && this.r1counter == this.exercise.howMuchTouches ){
              console.log("stop3");
              this.Stop(this.exercise);
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
            $("#final"+(i+1)).text($("#touch0"+ (this.swimmers.length - 1).toString()).text());
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route1.jump_time;
            resultToDb.results = result.routes.route1.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 1st" +  resultToDb)
            this.finalArrayResults.push(resultToDb);

          }else if(i == 1){
            $("#final"+(i+1)).text($("#touch1"+ (this.swimmers.length - 1).toString()).text());
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route2.jump_time;
            resultToDb.results = result.routes.route2.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 2nd" + resultToDb);
            this.finalArrayResults.push(resultToDb);

          }else if(i == 2){
            $("#final"+(i+1)).text($("#touch2"+ (this.swimmers.length - 1).toString()).text());
            var resultToDb = new OneRouteFinalResultModel();
            resultToDb.date = this.exercise.date;
            resultToDb.jump_time = result.routes.route3.jump_time;
            resultToDb.results = result.routes.route3.results;
            resultToDb.swimmer = new RouteModel();
            resultToDb.swimmer.swimmer_ref = this.exercise.routes.routes[i].swimmer_ref;
            resultToDb.swimmer.swimmer_id =  this.exercise.routes.routes[i].swimmer_id;
            resultToDb.exercise_id = this.exercise.id;
            console.log("data 3rd" + resultToDb);
            this.finalArrayResults.push(resultToDb);

          }
        }
      }
      console.log("final result ===> " + JSON.stringify(this.finalArrayResults))
      this.SaverecordInDB();
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

  /**
   * Save record in db
   */
  public SaverecordInDB():void{
    this.finalArrayResults.forEach(rec =>{
      if(rec !== undefined && rec !== null){
        //First check if the record is already in db
        this.httpservice.httpPost('records/chackRecords', { exercise_id: rec.exercise_id, swimmer_id: rec.swimmer.swimmer_id }).subscribe(
          res =>{
            console.log(res);
            //If the record is not already in db, creates it
            if(!res.isTrue){
              this.httpservice.httpPost('records/setrecords',rec).subscribe(
                res =>{
                  console.log(rec);
                  //update exercise to done
                  let model = {
                    hasBeenStarted: true,
                    exercise_id: rec.exercise_id,
                    training_id: this.trainning._id
                  }
                  //Then update the exercise to done
                  this.httpservice.httpPost('exercise/update',model).subscribe(
                    res=>{
                      console.log(res);
                    },
                    err =>{
                      this.OpenDialog();
                    }
                  )
                },
                err =>{
                  console.log(err);
                  this.OpenDialog();
                }
              )
            }
              //Then send Notification to swimmer that the exercise is ready to been seen
              var notification = new NotificationModel();
              notification.type = NotificationTypeEnum.Message;
              notification.coachmail = localStorage.getItem("email");
              notification.swimmer_id = rec.swimmer.swimmer_id;
              notification.date = new Date();
              notification.priority = "low";
              notification.title = "תוצאות אימון אחרון זמינות לצפיה!";
              notification.message = "כדי לצפות בתוצאות של האימון האחרון, היכנס להישגים בתפריט הצדדי";
              this.httpservice.httpPost('notification/setNotification', notification).subscribe(
                  res => { console.log(res)},
                  err => { console.log(err)}
              )
          },
          err =>{
            this.OpenDialog();
          }
        )
      }else{
        this.OpenDialog();
        return;
      }
    })
  }
  //#endregion

}
