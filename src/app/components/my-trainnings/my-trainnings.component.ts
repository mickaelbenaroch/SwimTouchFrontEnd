import { PageEnum } from '../../enums/componentview';
import { RouteModel } from '../../models/RouteModel';
import { TrainningModel } from '../../models/TrainningModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { ExerciseModel } from 'src/app/models/ExerciseModel';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { RoleEnum } from 'src/app/enums/roleenum';
import { ExerciseTypeEnum } from 'src/app/enums/exercisetypeenum';

@Component({
  selector: 'app-my-trainnings',
  templateUrl: './my-trainnings.component.html',
  styleUrls: ['./my-trainnings.component.scss']
})
export class MyTrainningsComponent implements OnInit {

  //#region Public Members
  @Output() GoBackEvent: EventEmitter<PageEnum> = new EventEmitter();
  public trainning: TrainningModel;
  public trainnings: TrainningModel[] = [];
  public details: boolean;
  public refill: boolean = false;
  public editRoute: boolean;
  public routes: string[] = [];
  public tempRoutesArray: RouteModel[] = [];
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
              public profileservice: ProfileServiceService) { }

  public ngOnInit(): void {
    if(this.profileservice.profile !== undefined && this.profileservice.profile.type == RoleEnum.Swimmer){
      let swimmerName = {
        name: this.profileservice.profile.first_name + ' ' + this.profileservice.profile.last_name
      }
      this.httpservice.httpPost('swimmer/getswimmers',swimmerName).subscribe(
        res =>{
            let idOfSwimmer = {
              swimmer_id: res.swimmer[0]._id
            }
            this.httpservice.httpPost('trainning/getSwimmerTrainnings',idOfSwimmer).subscribe(
              res => {
                this.trainnings = res.trainning;
              },  
              err =>{
                this.OpenDialog();
              }
            )
        },
        err =>{
          this.OpenDialog();
        }
      )
    }else{
      var model = {
        coachmail: localStorage.getItem("email")
      }
      this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
        res =>{
          this.trainnings = res.trainning;
        },
        err =>{
          this.OpenDialog();
          console.log(err);      
        }
      )
    }
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
   * Drop event
   */
  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.routes, event.previousIndex, event.currentIndex);
  }

  /**
   * Go back to calendar
   */
  public Back():void{
    this.details = false;
    this.refill = true;
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
 * Edit routes division
 * @param event 
 */
public EditRoutes(exercise: ExerciseModel):void{
  this.editRoute = true;
}

/**
 * SaveRoutes
 */
public SaveRoutes(exercise: ExerciseModel):void{  

  console.log("exercise before update :" + exercise)
  //first save the original routes array
  this.tempRoutesArray = exercise.routes.routes;
  var ExerciseModel = ExerciseModel = exercise;
  ExerciseModel.routes.routes = [];
  this.routes.forEach( r => {
    //then find the swimmer in the routes array
    var swimmer = this.tempRoutesArray.find(ro => ro.swimmer_ref == r);
    if( swimmer !== null){
      swimmer.number = this.routes.indexOf(r) + 1;
      ExerciseModel.routes.routes.push(swimmer); 
    }
  })
  //then update model in db
  console.log("exercise after update :" + ExerciseModel)
  this.httpservice.httpPost('exercise/updateExercise', ExerciseModel).subscribe(
    res =>{
      console.log("exercise updated");
      this.OpenSuccesDialogBox();
    },
    err =>{
      this.OpenDialog();
    }
  )
}

/**
 * FillRouteArray
 * @param event 
 */
public FillRouteArray(exercise: ExerciseModel):void{
  exercise.routes.routes.forEach( s =>{
    if(!this.routes.includes(s.swimmer_ref)){
      this.routes.push(s.swimmer_ref)
    }
  })
}

/**
 * Get current trainning details for son component
 */
public GetCurrentTrainning(event: TrainningModel):void{
  if(event !== null && event !== undefined){
    this.details = true;
    this.trainning = event;
    this.trainning.exercises.forEach(ex =>{
      switch(ex.type){
        case ExerciseTypeEnum.WarmUp:
        this.warmupcount += ex.distance;
        if(this.warmuparray !== undefined && this.warmuparray.length >= 1){
          this.warmuparray.forEach(exer =>{
              if(exer.description == ex.description && 
                exer.style == ex.style && 
                exer.singleSwimDistance == ex.singleSwimDistance && 
                exer.repeat == ex.repeat){
                  this.wurepeat += 1;
              }else{
                this.warmuparray.push(ex);
              }
            })
        }else{
          this.warmuparray.push(ex);
        }
        break;
        case ExerciseTypeEnum.BuildUp:
        this.buildupcount += ex.distance;
        if(this.builduparray !== undefined && this.builduparray.length >= 1){
          this.builduparray.forEach(exer =>{
            if(exer.description == ex.description && 
              exer.style == ex.style && 
              exer.singleSwimDistance == ex.singleSwimDistance && 
              exer.repeat == ex.repeat){
                this.burepeat += 1;
            }else{
              this.builduparray.push(ex);
            }
          })
        }else{
          this.builduparray.push(ex);
        }
        break;
        case ExerciseTypeEnum.Core:
        this.corecount += ex.distance;
        if(this.corearray !== undefined && this.corearray.length >= 1){
          this.corearray.forEach(exer =>{
            if(exer.description == ex.description && 
              exer.style == ex.style && 
              exer.singleSwimDistance == ex.singleSwimDistance && 
              exer.repeat == ex.repeat){
                this.corepeat += 1;
            }else{
              this.corearray.push(ex);
            }
          })
        }else{
          this.corearray.push(ex);
        }
        break;
        case ExerciseTypeEnum.WarmDown:
        this.warmdowncount += ex.distance;
        if(this.warmdownarray !== undefined && this.warmdownarray.length >= 1){
          this.warmdownarray.forEach(exer =>{
            if(exer.description == ex.description && 
               exer.style == ex.style && 
               exer.singleSwimDistance == ex.singleSwimDistance && 
               exer.repeat == ex.repeat){
                this.wdrepeat += 1;
            }else{
              this.warmdownarray.push(ex);
            }
          })
        }else{
          this.warmdownarray.push(ex);
        }
        break;
      }
    })
  }
}

/**
 * Open Succes box dialog
 */
public OpenSuccesDialogBox():void{
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title: "התרגיל עודכן בהצלחה",
    body: 'באפשרותך לערוך אותו בכל רגע ',
    button: true,
    buttonText: "הבנתי!"
  };

  dialogConfig.width = "560px";
  dialogConfig.height = "272px";
  this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}
  //#endregion
}
