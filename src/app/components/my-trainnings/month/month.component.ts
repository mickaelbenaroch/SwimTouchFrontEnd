import { DayModel } from '../../../models/DayModel';
import { MonthEnum } from '../../../enums/MonthEnum';
import { MonthModel } from '../../../models/MonthModel';
import { TrainningModel } from '../../../models/TrainningModel';
import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, AfterViewChecked,OnChanges{

  //#region Public Members
  @Output() trainningDetailEvent: EventEmitter<TrainningModel> = new EventEmitter;
  @Input() trains: TrainningModel[] = [];
  @Input() refill: boolean;
  public CurrentMonth: MonthModel;
  public monthEnum = MonthEnum;
  public done: boolean;
  //#endregion

  //region Constructor & Lifecycle Hooks
  public constructor() { 
    this.Init();
    this.FillMonthDays(this.CurrentMonth.lenght);
  }

  public ngOnInit():void{
  }

  public ngOnChanges(): void {
    if(this.refill){ 
      this.ResetModel();
      this.Init();
      this.FillMonthDays(this.CurrentMonth.lenght);
      this.ngAfterViewChecked();
    }
  } 

  public ngAfterViewChecked(): void {
      console.log("test "+ this.trains )
      this.trains.forEach(trainning => {
        var split = trainning.date.split('-');
        var month = split[1];
        var day = split[2];
        if(day[0] == '0'){
          day = day[1];
        }
        if(month == this.CurrentMonth.number.toString() || month == '0'+ this.CurrentMonth.number.toString()){
          //check for dupplicates values
          if(!this.CurrentMonth.DayArray[Number(day) -1].description.includes(trainning.name)){
            this.CurrentMonth.DayArray[ Number(day) - 1].description.push(trainning.name);
          }
        }
      })
  }
  //#endregion

  //#region Public Methods
  /**
   * Initialization of component view
   * @param lenght 
   */
  public Init():void{
    this.CurrentMonth = new MonthModel();
    var date = new Date();
    switch(date.getMonth())
    {
      case 0:
      this.CurrentMonth.number = 1;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "ינואר";
      break;
      case 1:
      this.CurrentMonth.number = 2;
      this.CurrentMonth.lenght = 28;
      this.CurrentMonth.name = "פברואר";
      break;
      case 2:
      this.CurrentMonth.number = 3;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מרץ";
      break;
      case 3:
      this.CurrentMonth.number = 4;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "אפריל";
      break;
      case 4:
      this.CurrentMonth.number = 5;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מאי";
      break;
      case 5:
      this.CurrentMonth.number = 6;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "יוני";
      break;
      case 6:
      this.CurrentMonth.number = 7;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "יולי";
      break;
      case 7:
      this.CurrentMonth.number = 8;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוגוסט";
      break;
      case 8:
      this.CurrentMonth.number = 9;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "ספטמבר";
      break;
      case 9:
      this.CurrentMonth.number = 10;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוקטובר";
      break;
      case 10:
      this.CurrentMonth.number = 11;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "נובמבר";
      break;
      case 11:
      this.CurrentMonth.number = 12;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "דצמבר";
      break;
    }
  }

   /**
   * Initialization of component view for next month
   * @param lenght 
   */
  public InitNextMonth():void{
    switch(this.CurrentMonth.number)
    {
      case 1:
      this.CurrentMonth.number = 2;
      this.CurrentMonth.lenght = 28;
      this.CurrentMonth.name = "פברואר";
      break;
      case 2:
      this.CurrentMonth.number = 3;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מרץ";
      break;
      case 3:
      this.CurrentMonth.number = 4;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "אפריל";
      break;
      case 4:
      this.CurrentMonth.number = 5;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מאי";
      break;
      case 5:
      this.CurrentMonth.number = 6;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "יוני";
      break;
      case 6:
      this.CurrentMonth.number = 7;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "יולי";
      break;
      case 7:
      this.CurrentMonth.number = 8;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוגוסט";
      break;
      case 8:
      this.CurrentMonth.number = 9;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "ספטמבר";
      break;
      case 9:
      this.CurrentMonth.number = 10;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוקטובר";
      break;
      case 10:
      this.CurrentMonth.number = 11;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "נובמבר";
      break;
      case 11:
      this.CurrentMonth.number = 12;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "דצמבר";
      break;
      case 12:
      this.CurrentMonth.number = 1;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "ינואר";
      break;
    }
    this.CurrentMonth.DayArray = [];
  }

  /**
   * Initialization of component view for next month
   * @param lenght 
   */
  public InitPreviousMonth():void{
    switch(this.CurrentMonth.number)
    {
      case 1:
      this.CurrentMonth.number = 12;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "דצמבר";
      break;
      case 2:
      this.CurrentMonth.number = 1;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "ינואר";
      break;
      case 3:
      this.CurrentMonth.number = 2;
      this.CurrentMonth.lenght = 28;
      this.CurrentMonth.name = "פברואר";
      break;
      case 4:
      this.CurrentMonth.number = 3;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מרץ";
      break;
      case 5:
      this.CurrentMonth.number = 4;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "אפריל";
      break;
      case 6:
      this.CurrentMonth.number = 5;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "מאי";
      break;
      case 7:
      this.CurrentMonth.number = 6;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "יוני";
      break;
      case 8:
      this.CurrentMonth.number = 7;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "יולי";
      break;
      case 9:
      this.CurrentMonth.number = 8;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוגוסט";
      break;
      case 10:
      this.CurrentMonth.number = 9;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "ספטמבר";
      break;
      case 11:
      this.CurrentMonth.number = 10;
      this.CurrentMonth.lenght = 31;
      this.CurrentMonth.name = "אוקטובר";
      break;
      case 12:
      this.CurrentMonth.number = 11;
      this.CurrentMonth.lenght = 30;
      this.CurrentMonth.name = "נובמבר";
      break;
    }
    this.CurrentMonth.DayArray = [];
  }

  /**
   * Fills the current month with its day quantiy
   * @param lenght 
   */
  public FillMonthDays(lenght: number):void{
    for(var i = 0; i<lenght; i++){
      var day = new DayModel();
      day.string = i+1;
      this.CurrentMonth.DayArray.push(day);
    }
  }

  /**
   * Shows trainning details
   */
  public TrainningDetails(trainningName: string){
    if(trainningName !== undefined && trainningName !== null){
      var currentTrainning = new TrainningModel();
      currentTrainning = this.trains.find(t => t.name == trainningName);
      this.trainningDetailEvent.emit(currentTrainning);
    }else{
      console.log("Error on getting trainning details");
      return;
    }
  }

  /**
   * Reset Model
   */
  public ResetModel():void{
    this.CurrentMonth.DayArray = [];
    this.CurrentMonth.lenght = undefined;
    this.CurrentMonth.name = undefined;
    this.CurrentMonth.number = undefined;
  }

  /***
   * Pass to PreviousMonth
   */
  public PreviousMonth():void{
    this.InitPreviousMonth();
    this.FillMonthDays(this.CurrentMonth.lenght);
    this.ngAfterViewChecked();
  }

  /**
   * Pass to NextMonth
   */
  public NextMonth():void{
    this.InitNextMonth();
    this.FillMonthDays(this.CurrentMonth.lenght);
    this.ngAfterViewChecked();
  }

  //#endregion
}
