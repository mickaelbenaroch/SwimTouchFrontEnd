import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { SwimmerTargetModel } from '../../models/SwimmerTargetModel';
import { HttpService } from '../../services/http-service/http-service.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  public temp: TeamModel[] = [];
  public currentTeam: TeamModel;
  public choosenSwimmer: boolean;
  public currentSwimmer: SwimmerModel;
  public SwimmerTargetModel: SwimmerTargetModel;
  //#endregion

  //#regiom Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService) { }

  public ngOnInit():void {
    var model = {
      coachmail: localStorage.getItem("email")
    }
    this.httpservice.httpGet(this.httpservice.apiUrl + "team/getteams").subscribe(
      (res: any) =>{
        this.temp = res.team;
        this.temp.forEach(team =>{
          if(team.coachmail == localStorage.getItem("email")){
            this.teams.push(team);
          }
        })

      },
      err =>{
        console.log(err);      }
    )
  }
  //#endregion

  //#region Public Methods
  /**
   * On selection change callback
   */
  public Select(event):void{
    if(event !== null && event !== undefined){
      this.currentTeam = event.value;
    }
  }

  /**
   * Get swimmer details
   */
  public SwimmerDetails(swimmer: SwimmerModel):void{
    console.log(swimmer);
    this.choosenSwimmer = true;
    this.currentSwimmer = swimmer;

  }

  /**
   * BackToSwimmerChoose
   */
  public BackToSwimmerChoose():void{
    this.choosenSwimmer = false;
  }

  /**
   * GetSwimmerTargets
   */
  public GetSwimmerTargets(): void{
    if(this.currentSwimmer == null || this.currentSwimmer == undefined){
      return;
    }else{
      var model = {
        Swimmer_ref: this.currentSwimmer._id
      }
      this.httpservice.httpPost('target/getswimmertarget', model).subscribe(
        res => {
          console.log(res);
        },
        err =>{
          console.log(err);
        }
      )
    }
  }

  //#endregion
}
