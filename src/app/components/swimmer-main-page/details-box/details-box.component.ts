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
  }
  //#endregion

  //#region Public Methods
    /**
   * ShowTrainning
   */
  public ShowTrainning(trainning: TrainningModel):void{
    this.ShowTodayTrainningDetails.emit(trainning);
  }
  //#endregion

}
