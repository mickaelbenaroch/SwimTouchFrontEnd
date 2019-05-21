import { Socket } from 'ngx-socket-io';
import { PageEnum } from '../../enums/componentview';
import { ExerciseModel } from '../../models/ExerciseModel';
import { FinalResultModel } from '../../models/FinalResult';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RealTrainningEnum } from '../../enums/realtrainningenum';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TvModeComponent } from '../dialog-boxes/tv-mode/tv-mode.component';
import { HttpService } from '../../services/http-service/http-service.service';
import { OneRouteFinalResultModel } from '../../models/FinalOneRouteResultModel';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import {ExerciseTypeEnum} from '../../enums/exercisetypeenum'

@Component({
  selector: 'app-real-time-trainning',
  templateUrl: './real-time-trainning.component.html',
  styleUrls: ['./real-time-trainning.component.scss']
})
export class RealTimeTrainningComponent implements OnInit {
  
   //#region Public Members
   @Output() GoBackEvent: EventEmitter<PageEnum> = new EventEmitter();
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
   public finalResultModel: FinalResultModel = new FinalResultModel();
   public ready: boolean;
   public typeenum = ExerciseTypeEnum;
   public warmupcount: number = 0;
   public buildupcount: number = 0;
   public corecount: number = 0;
   public warmdowncount: number = 0;
   public warmuparray: ExerciseModel[] = [];
   public builduparray: ExerciseModel[] = [];
   public corearray: ExerciseModel[] = [];
   public warmdownarray: ExerciseModel[] = [];
   public wurepeat: number = 1;
   public burepeat: number = 1;
   public corepeat: number = 1;
   public wdrepeat: number = 1;
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
   * Go back to main page
   */
  public GoBack(): void{
    this.GoBackEvent.emit(PageEnum.Landing);
  }

   /**
    * Choose a specific Exercise
    * @param trainning 
    */
   public ChooseExercise(exercise: ExerciseModel):void{debugger;
      if(exercise.hasBeenStarted !== undefined && (exercise.hasBeenStarted == true || exercise.hasBeenStarted == "true")){
        this.OpenDialogForExerciseAlreadyDone();
        return;
      }
      console.log(exercise);
      this.choosenExercise = exercise;
      for(let i = 0; i<this.choosenExercise.howMuchTouches; i++)
        this.temp.push('temp');
      this.state = RealTrainningEnum.RealTimeView;
   }

  /**
   * Filter of trainning array
   * @param trainning 
   */
  public Filter(str: string):void{
    var na = $("#namefilter").css('background-color','transparent');
    var da = $("#datefilter").css('background-color','transparent');
    var di = $("#distancefilter").css('background-color','transparent');
    switch(str){
      case 'date':
      da.css('background-color','yellow');
      this.trainnings = this.trainnings.sort((a,b)=>{
        if (a.date < b.date) //sort string ascending
         return -1;
        if (a.date > b.date)
         return 1;
        return 0; //default return value (no sorting)
      })
      break;
      case 'name':
      na.css('background-color','yellow');
      this.trainnings = this.trainnings.sort((a,b)=>{
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
      })
      break;
      case 'distance':
      di.css('background-color','yellow');
      this.trainnings = this.trainnings.sort((a,b)=>{
        if (a.distance < b.distance) //sort string ascending
         return -1;
        if (a.distance > b.distance)
         return 1;
        return 0; //default return value (no sorting)
      })
      break;
    }
  }

  /**
   * Back
   * @param trainning 
   */
  public Back():void{
    this.state = this.stateHelper.TrainningView;
    this.warmuparray = [];
    this.builduparray = [];
    this.corearray = [];
    this.warmdownarray = [];
  }

   /**
    * Get the choosed trainning
    */ 
   public ChooseTrainning(trainning: TrainningModel){
     console.log(trainning);
     this.choosenTrainning = trainning;  
     this.choosenTrainning.exercises.forEach(ex=>{
       switch(ex.type){
         case ExerciseTypeEnum.WarmUp:
         this.warmuparray.push(ex);
         this.warmupcount += ex.distance;
         break;
         case ExerciseTypeEnum.BuildUp:
         this.builduparray.push(ex);
         this.buildupcount += ex.distance;
         break;
         case ExerciseTypeEnum.Core:
         this.corearray.push(ex);
         this.corecount += ex.distance;
         break;
         case ExerciseTypeEnum.WarmDown:
         this.warmdownarray.push(ex);
         this.warmdowncount +=ex.distance;
         break;
       }
     })
     this.state = RealTrainningEnum.ExerciseView;
   }
   

   /**
    * Show table of record on tv mode
    */
    public ShowTvMode():void{
      const dialogConfig = new MatDialogConfig();
    
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        exercise: this.choosenExercise,
        swimmers: this.temp,
        trainning: this.choosenTrainning
      };
      dialogConfig.width = "100%";
      dialogConfig.height = "100%";
      dialogConfig.panelClass = "tv-dialog";
      var dialogRef = this.dialog.open(TvModeComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        (res: any) => {
            console.log( "after tv mode closed ==>" + res);
            var oneResult1 = new OneRouteFinalResultModel();
            var oneResult2 = new OneRouteFinalResultModel();
            var oneResult3 = new OneRouteFinalResultModel();
            if(res.routes !== undefined && res.routes.route3 !== undefined){
              for(let i = 0; i<res.routes.route1.results.length; i++){
                oneResult1.results.push(res.routes.route1.results[i]);
                oneResult1.total = res.routes.route1.results[res.routes.route1.results.length -1];
               }
            }
            if(res.routes !== undefined && res.routes.route2 !== undefined){
              for(let i = 0; i<res.routes.route2.results.length; i++){
                oneResult2.results.push(res.routes.route2.results[i]);
                oneResult2.total = res.routes.route2.results[res.routes.route2.results.length -1];
              }
            }
            if(res.routes !== undefined && res.routes.route3 !== undefined){
              for(let i = 0; i<res.routes.route3.results.length; i++){
                oneResult3.results.push(res.routes.route3.results[i]);
                oneResult3.total = res.routes.route3.results[res.routes.route3.results.length -1];
              }
            }
            oneResult1.swimmer.number = 1;
            if(this.choosenExercise.routes.routes[0] !== undefined){
              oneResult1.swimmer.swimmer_id = this.choosenExercise.routes.routes[0].swimmer_id;
              oneResult1.swimmer.swimmer_ref = this.choosenExercise.routes.routes[0].swimmer_ref;
              oneResult1.jump_time = res.routes.route1.jump_time;
              if(oneResult1.total > 60){
                oneResult1.total = oneResult1.total/60;
              }
              oneResult1.total = Number(oneResult1.total.toFixed(3));
              this.finalResultModel.routes.push(oneResult1);
            }
            oneResult2.swimmer.number = 2;
            if(this.choosenExercise.routes.routes[1] !== undefined){
              oneResult2.swimmer.swimmer_id = this.choosenExercise.routes.routes[1].swimmer_id;
              oneResult2.swimmer.swimmer_ref = this.choosenExercise.routes.routes[1].swimmer_ref;
              oneResult2.jump_time = res.routes.route2.jump_time;
              if(oneResult2.total > 60){
                oneResult2.total = oneResult2.total/60;
              }
              oneResult2.total = Number(oneResult2.total.toFixed(3));
              this.finalResultModel.routes.push(oneResult2);
            }
            oneResult3.swimmer.number = 3;
            if(this.choosenExercise.routes.routes[2] !== undefined){
              oneResult3.swimmer.swimmer_id = this.choosenExercise.routes.routes[2].swimmer_id;
              oneResult3.swimmer.swimmer_ref = this.choosenExercise.routes.routes[2].swimmer_ref;
              oneResult3.jump_time = res.routes.route3.jump_time;
              if(oneResult3.total > 60){
                oneResult3.total = oneResult3.total/60;
              }
              oneResult3.total = Number(oneResult3.total.toFixed(3));
              this.finalResultModel.routes.push(oneResult3);
            }
            this.ready = true;
            $(".tv").css('display','none');
        },
        err =>{
          this.OpenDialog();
        }
      )
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
    * Error dialog Box Opening
    * @param email 
    */
   public OpenDialogForExerciseAlreadyDone() {
    const dialogConfig = new MatDialogConfig();
 
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'שגיאה!',
      body: 'תרגיל זה כבר בוצע. אפשר לבצע תרגיל אך ורק פעם אחת',
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}

   //#endregion
  
}
