import { RoleEnum } from '../../../enums/roleenum';
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
 //#endregion
}
