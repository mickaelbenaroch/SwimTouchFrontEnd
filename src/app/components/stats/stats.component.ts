import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { SwimmerModel } from 'src/app/models/SwimmerModel';

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
    age: "31"
coachmail: "mickaelbenaroch@yahoo.fr"
group: "A"
height: "184"
name: "ליאור שחר"
picture: ""
_id: "6d0f88bb-a707-4756-bec4-d81f6aa52571"
  }
  //#endregion
}
