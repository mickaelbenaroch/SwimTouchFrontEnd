import { DayModel } from '../../../models/DayModel';
import { MonthEnum } from '../../../enums/MonthEnum';
import { MonthModel } from '../../../models/MonthModel';
import { TrainningModel } from '../../../models/TrainningModel';
import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent implements OnInit, AfterViewChecked,OnChanges{

  //#region Public Members
  @Output() trainningDetailEvent: EventEmitter<TrainningModel> = new EventEmitter;
  @Input() trains: TrainningModel[] = [];
  @Input() refill: boolean;
  @Input() trDetail: TrainningModel;
  public CurrentMonth: MonthModel;
  public monthEnum = MonthEnum;
  public done: boolean;
  public months: string[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  public constructor() { 
    this.Init();
    this.FillMonthDays(this.CurrentMonth.lenght);
  }

  public ngOnInit():void{
    this.DivideDays();
  }

  public ngOnChanges(): void {
    if(this.refill){ 
      this.ResetModel();
      this.Init();
      this.FillMonthDays(this.CurrentMonth.lenght);
      this.ngAfterViewChecked();
    }
    if(this.trDetail !== undefined){
      this.TrainningDetails(this.trDetail.name);
    }
    var today = new Date();
    this.CurrentMonth.DayArray.forEach(day =>{
      if(Number(day.string) == today.getDate()){
        $("#day" + day.string).css('background', '#82CAFF');
      }else if(Number(day.string) < today.getDate()){
        $("#day" + day.string).css('background', '#EDEFEE');
        $("#day" + day.string).css('opacity', 0.4);
      }else if(Number(day.string) > today.getDate()){
        $("#day" + day.string).css('background', '#FFFFFF');
      }
    })
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
            this.CurrentMonth.DayArray[ Number(day) -1 ].group = trainning.exercises[0].group;
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
    this.DivideDays();
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
    this.DivideDays();
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
    this.ngOnChanges();
    var today = new Date();
    this.CurrentMonth.DayArray.forEach(day =>{
      if(Number(day.string) == today.getDate()){
        $("#day" + day.string).css('background', '#82CAFF');
      }else if(Number(day.string) < today.getDate()){
        $("#day" + day.string).css('background', '#F08080');
        $("#day" + day.string).css('opacity', 0.4);
      }else if(Number(day.string) > today.getDate()){
        $("#day" + day.string).css('background', '#eafeea');
      }
    })
  }
  
  /**
   * Pass to NextMonth
   */
  public NextMonth():void{
    this.InitNextMonth();
    this.FillMonthDays(this.CurrentMonth.lenght);
    this.ngAfterViewChecked();
    this.ngOnChanges();
    var today = new Date();
    this.CurrentMonth.DayArray.forEach(day =>{
      if(Number(day.string) == today.getDate()){
        $("#day" + day.string).css('background', '#82CAFF');
      }else if(Number(day.string) < today.getDate()){
        $("#day" + day.string).css('background', '#F08080');
        $("#day" + day.string).css('opacity', 0.4);
      }else if(Number(day.string) > today.getDate()){
        $("#day" + day.string).css('background', '#eafeea');
      }
    })
  }

  /**
   * Divide days of the month
   */
  public DivideDays():void{
    this.months = [];
    if(this.CurrentMonth == undefined){
      return;
    }
    switch(this.CurrentMonth.number - 1){
      case 0:
      this.months.push('ג'); this.months.push('ד'); this.months.push('ה'); 
      this.months.push('ו'); this.months.push('ש'); this.months.push('א'); this.months.push('ב'); 
      break;
      case 1:
      this.months.push('ו'); this.months.push('ש'); this.months.push('א'); 
      this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); this.months.push('ה'); 
      break;
      case 2:
      this.months.push('ו'); this.months.push('ש'); this.months.push('א'); 
      this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); this.months.push('ה');      
      break;
      case 3:
      this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); 
      this.months.push('ה'); this.months.push('ו'); this.months.push('ש'); this.months.push('א'); 
      break;
      case 4:
      this.months.push('ד'); this.months.push('ה'); this.months.push('ו'); 
      this.months.push('ש'); this.months.push('א'); this.months.push('ב'); this.months.push('ג'); 
      break;
      case 5:
      this.months.push('ש'); this.months.push('א'); this.months.push('ב'); 
      this.months.push('ג'); this.months.push('ד'); this.months.push('ה'); this.months.push('ו'); 
      break;
      case 6:
      this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); 
      this.months.push('ה'); this.months.push('ו'); this.months.push('ש'); this.months.push('א'); 
      break;
      case 7:
      this.months.push('ה'); this.months.push('ו'); this.months.push('ש'); 
      this.months.push('א'); this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); 
      break;
      case 8:
      this.months.push('א'); this.months.push('ב'); this.months.push('ג'); 
      this.months.push('ד'); this.months.push('ה'); this.months.push('ו'); this.months.push('ש'); 
      break;
      case 9:
      this.months.push('ג'); this.months.push('ד'); this.months.push('ה'); 
      this.months.push('ו'); this.months.push('ש'); this.months.push('א'); this.months.push('ב'); 
      break;
      case 10:
      this.months.push('ו'); this.months.push('ש'); this.months.push('א'); 
      this.months.push('ב'); this.months.push('ג'); this.months.push('ד'); this.months.push('ה');    
      break;
      case 11:
      this.months.push('א'); this.months.push('ב'); this.months.push('ג'); 
      this.months.push('ד'); this.months.push('ה'); this.months.push('ו'); this.months.push('ש'); 
      break;
    }
  }


  //#endregion
}
