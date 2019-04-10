import { PageEnum } from '../../enums/componentview';
import { RouteModel } from '../../models/RouteModel';
import { TrainningModel } from '../../models/TrainningModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { ExerciseModel } from 'src/app/models/ExerciseModel';

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
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog) { }

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
