import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { RoleEnum } from '../../enums/roleenum';
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-matalots',
  templateUrl: './matalots.component.html',
  styleUrls: ['./matalots.component.scss']
})
export class MatalotsComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  public temp: TeamModel[] = [];
  public currentTeam: TeamModel;
  public records: any[] = [];
  public choosenSwimmer: boolean;
  public teamChoosen: boolean;
  public currentSwimmer: SwimmerModel;
  public teamRecords:any[] = [];
  public targ: boolean;
  public graphReady: boolean;
  public recorsBetterThanTarget: any[] = [];
  public recorsNotBetterThanTarget: any[] = [];
  public recorsBetterThanTargetForTeam: any[] = [];
  public recorsNotBetterThanTargetForTeam: any[] = [];
  public FreestyleArray: any[] = [];
  public BackstrokeArray: any[] = [];
  public BreaststrokeArray: any[] = [];
  public ButterflyArray: any[] = [];
  public IndividualMedleyArray: any[] = [];

  //chart
  public lineChartData: any[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black', 
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor( private dialog: MatDialog,
              public httpservice: HttpService,
              public profileservice: ProfileServiceService,) { }

  public ngOnInit(): void {
  //the user is a trainner
  if(this.profileservice.profile !== undefined && this.profileservice.profile.type == RoleEnum.Trainner){
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
        this.OpenErrorDialogBox();      
      }
    )
  }
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
    this.teamChoosen = false;
    this.currentSwimmer = swimmer;
    var model = {
      swimmer_id: this.currentSwimmer._id
    }
    //First getting all the records of the choosen swimmer
    this.httpservice.httpPost('statistic/full_records', model).subscribe(
        res=>{
            if(res !== undefined && res.records !== undefined){
              this.records = res.records;
            }
        },
        err =>{
          this.OpenErrorDialogBox();
        }
    );
  }

  /**
   * BackToSwimmerChoose 
   */
  public BackToSwimmerChoose():void{
    this.choosenSwimmer = false;
    this.teamChoosen = false;
    if(this.targ){
      this.targ = false;
    }
    this.recorsBetterThanTarget = [];
    this.recorsNotBetterThanTarget = [];
    this.recorsBetterThanTargetForTeam = [];
    this.recorsNotBetterThanTargetForTeam = [];
  }

  /**
 * AllTheTeamChoosen, gets from backend all the swimmers of team record
 * @param target 
 */
public AllTheTeamChoosen():void{
  this.teamChoosen = true;
  this.choosenSwimmer = true;
  this.currentTeam.swimmers.forEach((swimmer: any) =>{
    this.httpservice.httpPost('statistic/full_records',{swimmer_id: swimmer._id}).subscribe(
      res =>{
        var temp1 = { data: [], label: 'Freestyle' };
        var temp2 = { data: [], label: 'Backstroke' };
        var temp3 = { data: [], label: 'Breaststroke' };
        var temp4 = { data: [], label: 'Butterfly' };
        var temp5 = { data: [], label: 'Individual Medley' };

        //'Freestyle','Backstroke','Breaststroke','Butterfly','Individual Medley'
        if(res !== undefined && res.records !== undefined){
          res.records.forEach(rec => {
            this.teamRecords.push(rec);
            if(rec.results !== undefined && rec.results !== null){
              switch(rec.exercise_id.style){
                case 'Freestyle':
                temp1.data.push(rec.results[rec.results.length -1]);
                if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
                  this.lineChartLabels.push(rec.date.substring(0,10));
                this.FreestyleArray.push(rec);
                break;
                case 'Backstroke':
                temp2.data.push(rec.results[rec.results.length -1]);
                if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
                  this.lineChartLabels.push(rec.date.substring(0,10));
                this.BackstrokeArray.push(rec);
                break;
                case 'Breaststroke':
                temp3.data.push(rec.results[rec.results.length -1]);
                if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
                  this.lineChartLabels.push(rec.date.substring(0,10));
                this.BreaststrokeArray.push(rec);
                break;
                case 'Butterfly':
                temp4.data.push(rec.results[rec.results.length -1]);
                if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
                  this.lineChartLabels.push(rec.date.substring(0,10));
                this.ButterflyArray.push(rec);
                break;
                case 'Individual Medley':
                temp5.data.push(rec.results[rec.results.length -1]);
                if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
                  this.lineChartLabels.push(rec.date.substring(0,10));
                this.IndividualMedleyArray.push(rec);
                break;
              }
            }
          });
          this.lineChartData.push(temp1);
          this.lineChartData.push(temp2);
          this.lineChartData.push(temp3);
          this.lineChartData.push(temp4);
          this.lineChartData.push(temp5);
          console.log(this.teamRecords)
          this.graphReady = true;
        }
      },
      err =>{
        this.OpenErrorDialogBox();
      }
    )
  })
}

  /**
  * Cleans graph data and labels
  */
  public CleanGraph():void{
    this.lineChartData = [];
    this.lineChartLabels = [];
  }

  /**
   * Display All styles records
   */
  public DisplayAll():void{
    this.CleanGraph();
    this.AllTheTeamChoosen();
  }

  /**
   * Displays only freestyle records
   */
  public DisplayFreestyle():void{
    this.CleanGraph();
    var temp = { data: [], label: 'Freestyle' };
    this.FreestyleArray.forEach(rec =>{
    temp.data.push(rec.results[rec.results.length -1]);
      if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
        this.lineChartLabels.push(rec.date.substring(0,10));
    })
    this.lineChartData.push(temp);
  }
  
  /**
   * Displays only Backstroke record
   */
  public DisplayBackstroke():void{
    this.CleanGraph();
    var temp = { data: [], label: 'Backstroke' };
    this.BackstrokeArray.forEach(rec =>{
    temp.data.push(rec.results[rec.results.length -1]);
      if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
        this.lineChartLabels.push(rec.date.substring(0,10));
    })
    this.lineChartData.push(temp);
  }
  
  /**
   * Displays only Breaststroke record 
   */
  public DisplayBreaststroke():void{
    this.CleanGraph();
    var temp = { data: [], label: 'Breaststroke' };
    this.BreaststrokeArray.forEach(rec =>{
    temp.data.push(rec.results[rec.results.length -1]);
      if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
        this.lineChartLabels.push(rec.date.substring(0,10));
    })
    this.lineChartData.push(temp);
  }
  
  /**
   * Displays only Butterfly record 
   */
  public DisplayButterfly():void{
    this.CleanGraph();
    var temp = { data: [], label: 'Butterfly' };
    this.ButterflyArray.forEach(rec =>{
    temp.data.push(rec.results[rec.results.length -1]);
      if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
        this.lineChartLabels.push(rec.date.substring(0,10));
    })
  }
  
  /**
   * Displays only Individual Medley record 
   */
  public DisplayIndividualMedley():void{
    this.CleanGraph();
    var temp = { data: [], label: 'Individual Medley' };
    this.IndividualMedleyArray.forEach(rec =>{
    temp.data.push(rec.results[rec.results.length -1]);
      if(!this.lineChartLabels.includes(rec.date.substring(0,10)))
        this.lineChartLabels.push(rec.date.substring(0,10));
    })
    this.lineChartData.push(temp);
  }


  /**
   * Open Dialog error box
   */
  public OpenErrorDialogBox():void{
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
  //#endregion

}
