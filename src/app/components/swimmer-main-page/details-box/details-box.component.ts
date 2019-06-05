import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TeamModel } from '../../../models/TeamModel';
import { TrainningModel } from '../../../models/TrainningModel';
import { HttpService } from '../../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../../services/profile-service/profile-service.service';

@Component({
  selector: 'app-details-box',
  templateUrl: './details-box.component.html',
  styleUrls: ['./details-box.component.scss']
})
export class DetailsBoxComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  public trainnings: TrainningModel[] = [];
  @Output() ShowTodayTrainningDetails: EventEmitter<TrainningModel> = new EventEmitter();

  hebrew_days: string;
   hebrew_mon: string;
   today_days: number
  //#endregion

  //#region Constructor & Lyfecycle Hooks
  constructor(public profileservice: ProfileServiceService,
              public httpservice: HttpService) { }

  public ngOnInit(): void {
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
              res.trainning.forEach(tr => {
                if(new Date(tr.date).toDateString() == new Date().toDateString()){
                  this.trainnings.push(tr);
                }
              });
            },  
            err =>{
              console.log(err);            }
          )
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
   * ShowTrainning
   */
  public ShowTrainning(trainning: TrainningModel = null):void{
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
