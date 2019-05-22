import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { RoleEnum } from '../../enums/roleenum';
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { RecordDetailsComponent } from '../dialog-boxes/record-details/record-details.component';
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
  public columnView: boolean = false;
  public distances: number[] = [];
  public currentDistance: number;
  public swimmerGraphReady: boolean;
  public index: any;
  public value: any;
  public label: any;
  public style: any;

  //chart
  public lineChartDataFreestyle: any[] = [{ data: [], label: 'Freestyle' }];
  public lineChartLabelsFreestyle: any[] = [];

  public lineChartDataBackstroke: any[] = [ { data: [], label: 'Backstroke' }];
  public lineChartLabelsBackstroke: any[] = [];

  public lineChartDataBreaststroke: any[] = [{ data: [], label: 'Breaststroke' }];
  public lineChartLabelsBreaststroke: any[] = [];

  public lineChartDataButterfly: any[] = [{ data: [], label: 'Butterfly' }];
  public lineChartLabelsButterfly: any[] = [];

  public lineChartDataIndividualMedley: any[] = [{ data: [], label: 'Individual Medley' }];
  public lineChartLabelsIndividualMedley: any[] = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
       {
           display: true,
           ticks: {
             fontSize: 10
           }
       }
     ]
   }
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
   * ChangeView of graph presentation 
   */
  public ChangeView():void{
    if(!this.columnView){
      this.lineChartOptions.maintainAspectRatio = true;
      $(".canvas").removeClass("canvas");
      $(".canvaselement").addClass("canvas2");
      this.columnView  = true;
    }else{
      this.lineChartOptions.maintainAspectRatio = false;
      $(".canvas2").removeClass("canvas2");
      $(".canvaselement").addClass("canvas");
      this.columnView  = false;
    }
  }

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
    this.CleanArrays();
    console.log(swimmer);
    this.graphReady = false;
    this.swimmerGraphReady = true;
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
              if(res !== undefined && res.records !== undefined){
                res.records.forEach(rec => {
                  this.teamRecords.push(rec);
                  if(rec.results !== undefined && rec.results !== null){
                    switch(rec.exercise_id.style){
                      case 'Freestyle':
                      this.lineChartDataFreestyle[0].data.push(rec.results[rec.results.length -1]);
                      this.lineChartLabelsFreestyle.push(rec.date.substring(0,10));
                      if(!this.distances.includes(rec.exercise_id.distance)){
                        this.distances.push(rec.exercise_id.distance);
                      }
                      this.FreestyleArray.push(rec);
                      break;
                      case 'Backstroke':
                      this.lineChartDataBackstroke[0].data.push(rec.results[rec.results.length -1]);
                      this.lineChartLabelsBackstroke.push(rec.date.substring(0,10));
                      if(!this.distances.includes(rec.exercise_id.distance)){
                        this.distances.push(rec.exercise_id.distance);
                      }
                      this.BackstrokeArray.push(rec);
                      break;
                      case 'Breaststroke':
                      this.lineChartDataBreaststroke[0].data.push(rec.results[rec.results.length -1]);
                      this.lineChartLabelsBreaststroke.push(rec.date.substring(0,10));
                      if(!this.distances.includes(rec.exercise_id.distance)){
                        this.distances.push(rec.exercise_id.distance);
                      }
                      this.BreaststrokeArray.push(rec);
                      break;
                      case 'Butterfly':
                      this.lineChartDataButterfly[0].data.push(rec.results[rec.results.length -1]);
                      this.lineChartLabelsButterfly.push(rec.date.substring(0,10));
                      if(!this.distances.includes(rec.exercise_id.distance)){
                        this.distances.push(rec.exercise_id.distance);
                      }
                      this.ButterflyArray.push(rec);
                      break;
                      case 'Individual Medley':
                      this.lineChartDataIndividualMedley[0].data.push(rec.results[rec.results.length -1]);
                      this.lineChartLabelsIndividualMedley.push(rec.date.substring(0,10));
                      if(!this.distances.includes(rec.exercise_id.distance)){
                        this.distances.push(rec.exercise_id.distance);
                      }
                      this.IndividualMedleyArray.push(rec);
                      break;
                    }
                  }
                });
                this.SortLabelsArrays();
                //TODO: FIX SORT ARRAY BUG
      }
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
  this.swimmerGraphReady = false;
  this.teamChoosen = true;
  this.choosenSwimmer = true;
  this.currentTeam.swimmers.forEach((swimmer: any) =>{
    this.httpservice.httpPost('statistic/full_records',{swimmer_id: swimmer._id}).subscribe(
      res =>{
        if(res !== undefined && res.records !== undefined){
                  res.records.forEach(rec => {
                    this.teamRecords.push(rec);
                    if(rec.results !== undefined && rec.results !== null){
                      switch(rec.exercise_id.style){
                        case 'Freestyle':
                        this.lineChartDataFreestyle[0].data.push(rec.results[rec.results.length -1]);
                        this.lineChartLabelsFreestyle.push(rec.date.substring(0,10));
                        if(!this.distances.includes(rec.exercise_id.distance)){
                          this.distances.push(rec.exercise_id.distance);
                        }
                        this.FreestyleArray.push(rec);
                        break;
                        case 'Backstroke':
                        this.lineChartDataBackstroke[0].data.push(rec.results[rec.results.length -1]);
                        this.lineChartLabelsBackstroke.push(rec.date.substring(0,10));
                        if(!this.distances.includes(rec.exercise_id.distance)){
                          this.distances.push(rec.exercise_id.distance);
                        }
                        this.BackstrokeArray.push(rec);
                        break;
                        case 'Breaststroke':
                        this.lineChartDataBreaststroke[0].data.push(rec.results[rec.results.length -1]);
                        this.lineChartLabelsBreaststroke.push(rec.date.substring(0,10));
                        if(!this.distances.includes(rec.exercise_id.distance)){
                          this.distances.push(rec.exercise_id.distance);
                        }
                        this.BreaststrokeArray.push(rec);
                        break;
                        case 'Butterfly':
                        this.lineChartDataButterfly[0].data.push(rec.results[rec.results.length -1]);
                        this.lineChartLabelsButterfly.push(rec.date.substring(0,10));
                        if(!this.distances.includes(rec.exercise_id.distance)){
                          this.distances.push(rec.exercise_id.distance);
                        }
                        this.ButterflyArray.push(rec);
                        break;
                        case 'Individual Medley':
                        this.lineChartDataIndividualMedley[0].data.push(rec.results[rec.results.length -1]);
                        this.lineChartLabelsIndividualMedley.push(rec.date.substring(0,10));
                        if(!this.distances.includes(rec.exercise_id.distance)){
                          this.distances.push(rec.exercise_id.distance);
                        }
                        this.IndividualMedleyArray.push(rec);
                        break; 
                      }
                    }
                  });
                  this.SortLabelsArrays();
        }
      },
      err =>{
        this.OpenErrorDialogBox();
      }
    )
  })
    console.log(this.teamRecords)
    this.graphReady = true;
    
}

  /**
   * Refill Graphs
   */
   public RefillGraphsForTeam():void{
    this.currentTeam.swimmers.forEach((swimmer: any) =>{
      this.httpservice.httpPost('statistic/full_records',{swimmer_id: swimmer._id}).subscribe(
        res =>{
          if(res !== undefined && res.records !== undefined){
                    res.records.forEach(rec => {
                      this.teamRecords.push(rec);
                      if(rec.results !== undefined && rec.results !== null){
                        switch(rec.exercise_id.style){
                          case 'Freestyle':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataFreestyle[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsFreestyle.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.FreestyleArray.push(rec);
                          }
                          break;
                          case 'Backstroke':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataBackstroke[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsBackstroke.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.BackstrokeArray.push(rec);
                          }
                          break;
                          case 'Breaststroke':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataBreaststroke[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsBreaststroke.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.BreaststrokeArray.push(rec);
                          }
                          break;
                          case 'Butterfly':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataButterfly[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsButterfly.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.ButterflyArray.push(rec);
                          }
                          break;
                          case 'Individual Medley':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataIndividualMedley[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsIndividualMedley.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.IndividualMedleyArray.push(rec);
                          }
                          break;
                        }
                      }
                    });
                    this.SortLabelsArrays();
          }
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
    })
   }

     /**
   * Refill Graphs
   */
  public RefillGraphsForSwimmer():void{
      this.httpservice.httpPost('statistic/full_records',{swimmer_id: this.currentSwimmer._id}).subscribe(
        res =>{
          if(res !== undefined && res.records !== undefined){
                    res.records.forEach(rec => {
                      this.records.push(rec);
                      if(rec.results !== undefined && rec.results !== null){
                        switch(rec.exercise_id.style){
                          case 'Freestyle':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataFreestyle[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsFreestyle.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.FreestyleArray.push(rec);
                          }
                          break;
                          case 'Backstroke':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataBackstroke[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsBackstroke.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.BackstrokeArray.push(rec);
                          }
                          break;
                          case 'Breaststroke':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataBreaststroke[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsBreaststroke.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.BreaststrokeArray.push(rec);
                          }
                          break;
                          case 'Butterfly':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataButterfly[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsButterfly.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.ButterflyArray.push(rec);
                          }
                          break;
                          case 'Individual Medley':
                          if(rec.exercise_id.distance == this.currentDistance){
                            this.lineChartDataIndividualMedley[0].data.push(rec.results[rec.results.length -1]);
                            this.lineChartLabelsIndividualMedley.push(rec.date.substring(0,10));
                            if(!this.distances.includes(rec.exercise_id.distance)){
                              this.distances.push(rec.exercise_id.distance);
                            }
                            this.IndividualMedleyArray.push(rec);
                          }
                          break;
                        }
                      }
                    });
                    this.SortLabelsArrays();
          }
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
   }

  /**
   * Sorts five labels arrays 
   */
  public SortLabelsArrays():void{
      this.lineChartLabelsFreestyle.sort ( (a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });
      this.lineChartLabelsBackstroke.sort ( (a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });
    this.lineChartLabelsBreaststroke.sort ( (a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    this.lineChartLabelsButterfly.sort ( (a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    this.lineChartLabelsIndividualMedley.sort ( (a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
  }
  
  /**
   * On distance Select change
   */
  public SelectDistanceForTeam(event: any):void{
    if(event.value !== 0 && event.value !== undefined){
      this.currentDistance = event.value;
      this.CleanArrays();
      this.RefillGraphsForTeam();
    }
  }

  /**
   * On distance Select change
   */
  public SelectDistanceForSwimmer(event: any):void{
    if(event.value !== 0 && event.value !== undefined){
      this.currentDistance = event.value;
      this.CleanArrays();
      this.RefillGraphsForSwimmer();
    }
  }

  /**
   * Chart clicked event callback
   */
  public ChartClickedForTeam(event):void{debugger
    if (event.active.length > 0) {
      const chart = event.active[0]._chart;
      this.style = event.active[0]._chart.tooltip._data.datasets[0].label;
      const activePoints = chart.getElementAtEvent(event.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        this.index = activePoints[0]._index;
        this.label = chart.data.labels[this.index];
        // get value by index
        this.value = chart.data.datasets[0].data[this.index];
        console.log(this.index, this.label, this.value, this.style);
        var result;
        this.teamRecords.forEach(rec =>{
          if(rec.date.includes(this.label) && rec.results[rec.results.length -1] == this.value && rec.exercise_id.style == this.style){
            result = rec;
          }
        })
         
        if(result !== null && result !== undefined){
          this.OpenRecordDetailsBox(result);
        }
      }
    }
  }

   /**
   * Chart clicked event callback
   */
  public ChartClickedForSwimmer(event):void{debugger
    if (event.active.length > 0) {
      const chart = event.active[0]._chart;
      this.style = event.active[0]._chart.tooltip._data.datasets[0].label;
      const activePoints = chart.getElementAtEvent(event.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        this.index = activePoints[0]._index;
        this.label = chart.data.labels[this.index];
        // get value by index
        this.value = chart.data.datasets[0].data[this.index];
        console.log(this.index, this.label, this.value, this.style);
        var result;
        this.records.forEach(rec =>{
          if(rec.date.includes(this.label) && rec.results[rec.results.length -1] == this.value && rec.exercise_id.style == this.style){
            result = rec;
          }
        })
         
        if(result !== null && result !== undefined){
          this.OpenRecordDetailsBox(result);
        }
      }
    }
  }

  /**
   * Clean all arrays
   */
  public CleanArrays():void{
    this.lineChartDataFreestyle[0].data = [];
    this.lineChartDataBackstroke[0].data = [];
    this.lineChartDataBreaststroke[0].data = [];
    this.lineChartDataButterfly[0].data = [];
    this.lineChartDataIndividualMedley[0].data = [];

    this.lineChartLabelsFreestyle = [];
    this.lineChartLabelsBackstroke = [];
    this.lineChartLabelsBreaststroke = [];
    this.lineChartLabelsButterfly = [];
    this.lineChartLabelsIndividualMedley = [];
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

    /**
   * Open Dialog error box
   */
  public OpenRecordDetailsBox(rec: any):void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      record: rec,
    };
    dialogConfig.width = "653px";
    dialogConfig.height = "550px";
    this.dialog.open(RecordDetailsComponent, dialogConfig);
  }
  //#endregion

}
