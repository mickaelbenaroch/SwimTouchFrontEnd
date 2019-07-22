import { TrainningModel } from '../../../models/TrainningModel';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service.service';
import { ProfileServiceService } from 'src/app/services/profile-service/profile-service.service';

@Component({
  selector: 'app-schedule-box',
  templateUrl: './schedule-box.component.html',
  styleUrls: ['./schedule-box.component.scss']
})
export class ScheduleBoxComponent implements OnInit {

  //#region public Members
  @Output() CalenderEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() ShowTodayTrainningDetails: EventEmitter<TrainningModel> = new EventEmitter();
  public trainnings: TrainningModel[] = [];

  hebrew_days: string;
  hebrew_mon: string;
  today_days: number
  //#endregion

  //#region Constructor & Lifecycle Hooks
  public constructor(public httpservice: HttpService,
                     public profileservice: ProfileServiceService) { }

  public ngOnInit(): void {
    var model = {
      coachmail: localStorage.getItem("email")
    }

    this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
      res =>{
        res.trainning.forEach(tr => {
          if(new Date(tr.date).toDateString() == new Date().toDateString()){
            this.trainnings.push(tr);
          }
        });
      },
      err =>{
        console.log(err);      
      }
    )

    this.hebrewDay();
  }
  //#endregion

  //#region Public Methods
  /**
   * GoToCalender
   */
  public GoToCalender():void{
    this.CalenderEvent.emit(true);
  }

  /**
   * ShowTrainning
   */
  public ShowTrainning(trainning: TrainningModel):void{
    this.ShowTodayTrainningDetails.emit(trainning);
  }

   /**
   * hebrew day
   */
  public hebrewDay():void{
    var today = new Date ( );
    
    var days = new Array ( );
    days[days.length] = "יום ראשון";
    days[days.length] = "יום שני";
    days[days.length] = "יום שלישי";
    days[days.length] = "יום רביעי";
    days[days.length] = "יום חמישי";
    days[days.length] = "יום שישי";
    days[days.length] = "יום שבת";
    
    var months = new Array ( );
    months[months.length] = "ינואר";
    months[months.length] = "פברואר";
    months[months.length] = "מרץ";
    months[months.length] = "אפריל";
    months[months.length] = "מאי";
    months[months.length] = "יוני";
    months[months.length] = "יולי";
    months[months.length] = "אוגוסט";
    months[months.length] = "ספטמבר";
    months[months.length] = "אוקטובר";
    months[months.length] = "נובמבר";
    months[months.length] = "דצמבר";

    this.hebrew_days = days[today.getDay()];
    this.hebrew_mon  = months[today.getMonth()];
    this.today_days  = today.getDate();
  }


 //#endregion
}
