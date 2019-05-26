import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TrainningModel } from '../../../models/TrainningModel';
import { HttpService } from 'src/app/services/http-service/http-service.service';

@Component({
  selector: 'app-schedule-box',
  templateUrl: './schedule-box.component.html',
  styleUrls: ['./schedule-box.component.scss']
})
export class ScheduleBoxComponent implements OnInit {

  //#region public Members
  @Output() CalenderEvent: EventEmitter<boolean> = new EventEmitter();
  public trainnings: TrainningModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  public constructor(public httpservice: HttpService) { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  /**
   * GoToCalender
   */
  public GoToCalender():void{
    this.CalenderEvent.emit(true);
  }
 //#endregion
}
