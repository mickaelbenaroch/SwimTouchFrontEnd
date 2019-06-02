import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { RoleEnum } from '../../enums/roleenum';
import { Component, OnInit, Input } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TeamTargetModel } from '../../models/TeamTargetModel';
import { NotificationModel } from '../../models/NotificationModel';
import { NotificationTypeEnum } from '../../enums/notificationtypeenum';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { RecordDetailsComponent } from '../dialog-boxes/record-details/record-details.component';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { ReturnStatement } from '@angular/compiler';

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
  public counter: number = 0;
  public swimmerAlone: boolean = false;
  public role = RoleEnum;
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
  public showIndicator: boolean;
  public jumpGraph: boolean;

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

  public lineChartDataFreestyleJump: any[] = [{ data: [], label: 'Freestyle' }];
  public lineChartLabelsFreestyleJump: any[] = [];

  public lineChartDataBackstrokeJump: any[] = [ { data: [], label: 'Backstroke' }];
  public lineChartLabelsBackstrokeJump: any[] = [];

  public lineChartDataBreaststrokeJump: any[] = [{ data: [], label: 'Breaststroke' }];
  public lineChartLabelsBreaststrokeJump: any[] = [];

  public lineChartDataButterflyJump: any[] = [{ data: [], label: 'Butterfly' }];
  public lineChartLabelsButterflyJump: any[] = [];

  public lineChartDataIndividualMedleyJump: any[] = [{ data: [], label: 'Individual Medley' }];
  public lineChartLabelsIndividualMedleyJump: any[] = [];


  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
       {
           display: true,
           //date font size
           ticks: {
             fontSize: 15
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

  public lineChartColors2: Color[] = [
    {
      borderColor: 'black', 
      backgroundColor: '#99e6ff',
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
  }else{
    this.httpservice.httpPost('swimmer/getswimmers', {_id: localStorage.getItem("swimmer_id")}).subscribe(
      res =>{
        this.swimmerAlone = true;
        this.currentSwimmer = res.swimmer[0];
        var evt = {
          value: this.currentSwimmer
        }
        this.SwimmerDetails(evt);
      }
    )
  }
  } 
  //#endregion 

  //#region Public Methods
  /**
   * Toggle view between jump time and results
   */
  public Switch(subject: string):void{
    this.counter += 1;
    if(subject == 'swim'){
      this.jumpGraph = false;
    }else{
      this.jumpGraph = true;
      if(this.teamChoosen && this.counter == 1){
        this.JumpTimeGraphTeam();
      }else if(!this.teamChoosen && this.counter == 1){
        this.jumpTimeGraphSwimmer();
      }
    }
  }

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
      this.showIndicator = true;
    }
    this.currentTeam.swimmers.forEach((swimmer: any) =>{
      this.httpservice.httpPost('statistic/full_records',{swimmer_id: swimmer._id}).subscribe(
        res =>{
          if(res !== undefined && res.records !== undefined){
            res.records.forEach(res =>{
              this.teamRecords.push(res);
              this.teamRecords.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              });
            })
          }
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )})
  }

  /**
   * Fill jump time graph for swimmers
   */
  public jumpTimeGraphSwimmer():void{
    let model = {
      swimmer_id: this.currentSwimmer._id
    }
    this.httpservice.httpPost('statistic/full_records', model).subscribe(
      res=>{
          if(res !== undefined && res.records !== undefined){
            this.records = res.records.sort ( (a, b) => {
              return new Date(a).getTime() - new Date(b).getTime();
          })
            if(res !== undefined && res.records !== undefined){
              res.records.forEach(rec => {
                if(rec.results !== undefined && rec.results !== null){
                  switch(rec.exercise_id.style){
                    case 'Freestyle':
                    this.lineChartDataFreestyleJump[0].data.push(rec.jump_time);
                    this.lineChartLabelsFreestyleJump.push(rec.date.substring(0,10));
                    if(!this.distances.includes(rec.exercise_id.distance)){
                      this.distances.push(rec.exercise_id.distance);
                    }
                    break;
                    case 'Backstroke':
                    this.lineChartDataBackstrokeJump[0].data.push(rec.jump_time);
                    this.lineChartLabelsBackstrokeJump.push(rec.date.substring(0,10));
                    if(!this.distances.includes(rec.exercise_id.distance)){
                      this.distances.push(rec.exercise_id.distance);
                    }
                    break;
                    case 'Breaststroke':
                    this.lineChartDataBreaststrokeJump[0].data.push(rec.jump_time);
                    this.lineChartLabelsBreaststrokeJump.push(rec.date.substring(0,10));
                    if(!this.distances.includes(rec.exercise_id.distance)){
                      this.distances.push(rec.exercise_id.distance);
                    }
                    break;
                    case 'Butterfly':
                    this.lineChartDataButterflyJump[0].data.push(rec.jump_time);
                    this.lineChartLabelsButterflyJump.push(rec.date.substring(0,10));
                    if(!this.distances.includes(rec.exercise_id.distance)){
                      this.distances.push(rec.exercise_id.distance);
                    }
                    break;
                    case 'Individual Medley':
                    this.lineChartDataIndividualMedleyJump[0].data.push(rec.jump_time);
                    this.lineChartLabelsIndividualMedleyJump.push(rec.date.substring(0,10));
                    if(!this.distances.includes(rec.exercise_id.distance)){
                      this.distances.push(rec.exercise_id.distance);
                    }
                    break;
                  }
                }
              });
    }
          }
      },
      err =>{
        this.OpenErrorDialogBox();
      }
  );
  }

  /**
   * Fill jump time graph for team
   * @param swimmer 
   */
  public JumpTimeGraphTeam():void{
    this.teamRecords.forEach(rec =>{
      switch(rec.exercise_id.style){
        case 'Freestyle':
          this.lineChartDataFreestyleJump[0].data.push(rec.jump_time);
          this.lineChartLabelsFreestyleJump.push(rec.date.substring(0,10));
          if(!this.distances.includes(rec.exercise_id.distance)){
            this.distances.push(rec.exercise_id.distance);
          }
          break;
          case 'Backstroke':
          this.lineChartDataBackstrokeJump[0].data.push(rec.jump_time);
          this.lineChartLabelsBackstrokeJump.push(rec.date.substring(0,10));
          if(!this.distances.includes(rec.exercise_id.distance)){
            this.distances.push(rec.exercise_id.distance);
          }
          break;
          case 'Breaststroke':
          this.lineChartDataBreaststrokeJump[0].data.push(rec.jump_time);
          this.lineChartLabelsBreaststrokeJump.push(rec.date.substring(0,10));
          if(!this.distances.includes(rec.exercise_id.distance)){
            this.distances.push(rec.exercise_id.distance);
          }
          break;
          case 'Butterfly':
          this.lineChartDataButterflyJump[0].data.push(rec.jump_time);
          this.lineChartLabelsButterflyJump.push(rec.date.substring(0,10));
          if(!this.distances.includes(rec.exercise_id.distance)){
            this.distances.push(rec.exercise_id.distance);
          }
          break;
          case 'Individual Medley':
          this.lineChartDataIndividualMedleyJump[0].data.push(rec.jump_time);
          this.lineChartLabelsIndividualMedleyJump.push(rec.date.substring(0,10));
          if(!this.distances.includes(rec.exercise_id.distance)){
            this.distances.push(rec.exercise_id.distance);
          }
          break;
      }
    })
  }


    /**
   * Get swimmer details
   */
  public SwimmerDetails(event: any):void{
    var swimmer = event.value;
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
              this.records = res.records.sort ( (a, b) => {
                return new Date(a).getTime() - new Date(b).getTime();
            })
              if(res !== undefined && res.records !== undefined){
                res.records.forEach(rec => {
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
              }
            }
            setTimeout(()=>{
              this.MakeAnalysis();
            })
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
  this.teamRecords.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  this.swimmerGraphReady = false;
  this.teamChoosen = true;
  this.choosenSwimmer = true;
  this.teamRecords.forEach(rec => {
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
    })
    console.log(this.teamRecords)
    this.graphReady = true;   
    setTimeout(()=>{
      this.MakeAnalysis();
    })
}

  /**
   * Refill Graphs
   */
   public RefillGraphsForTeam():void{
    this.teamRecords.forEach(rec => {
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
   }

     /**
   * Refill Graphs
   */
  public RefillGraphsForSwimmer():void{
      this.httpservice.httpPost('statistic/full_records',{swimmer_id: this.currentSwimmer._id}).subscribe(
        res =>{
            this.records = res.records.sort((a, b) => {
              return new Date(a).getTime() - new Date(b).getTime();
          });
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
  public ChartClickedForTeam(event):void{
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
  public ChartClickedForSwimmer(event):void{
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
  public OpenSimpleMessageBox(message: string):void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'הודעה חשובה',
      body: message,
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
    dialogConfig.height = "650px";
    this.dialog.open(RecordDetailsComponent, dialogConfig);
  }

  /**
   * Make Analysis of records
   */
  public MakeAnalysis():void{
    if(this.teamChoosen){
      var freestyleAvaerage = 0;
      for(var i = 0; i < this.FreestyleArray.length; i++){
          freestyleAvaerage += this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1];
          if(i == this.FreestyleArray.length -1){
            freestyleAvaerage = freestyleAvaerage / this.FreestyleArray.length;
            console.log("Freestyle Records Average :" + freestyleAvaerage);
            //Check if the last record is under or over the average
            if(this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1] > freestyleAvaerage){
              if(i > 2){
                if(this.FreestyleArray[i-1].results[this.FreestyleArray[i].results.length - 1] > freestyleAvaerage)
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
                this.sendNotificationForTeamTarget(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
                this.sendNotificationForTeamTarget(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
              }
            }else if(this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1] < freestyleAvaerage){
              if(i > 2){
                if(this.FreestyleArray[i-1].results[this.FreestyleArray[i].results.length - 1] < freestyleAvaerage)
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון " );
                this.sendNotificationForTeamTarget(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
                this.sendNotificationForTeamTarget(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
              }
            }
          }
      }


      var backstrokeAvaerage = 0;
      for(var i = 0; i < this.BackstrokeArray.length; i++){
        backstrokeAvaerage += this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1];
          if(i == this.BackstrokeArray.length -1){
            backstrokeAvaerage = backstrokeAvaerage / this.BackstrokeArray.length;
            console.log("Backstroke Records Average :" + backstrokeAvaerage);
            //Check if the last record is under or over the average
            if(this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1] > backstrokeAvaerage){
              if(i > 2){
                if(this.BackstrokeArray[i-1].results[this.BackstrokeArray[i].results.length - 1] > backstrokeAvaerage)
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
                this.sendNotificationForTeamTarget(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
                this.sendNotificationForTeamTarget(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון ");
              }
            }else if(this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1] < backstrokeAvaerage){
              if(i > 2){
                if(this.BackstrokeArray[i-1].results[this.BackstrokeArray[i].results.length - 1] < backstrokeAvaerage)
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון " );
                this.sendNotificationForTeamTarget(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
                this.sendNotificationForTeamTarget(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
              }
            }
          }
      }

      var breatstrokeAvaerage = 0;
      for(var i = 0; i < this.BreaststrokeArray.length; i++){
        breatstrokeAvaerage += this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1];
          if(i == this.BreaststrokeArray.length -1){
            breatstrokeAvaerage = breatstrokeAvaerage / this.BreaststrokeArray.length;
            console.log("Breastroke Average :" + breatstrokeAvaerage);
            //Check if the last record is under or over the average
            if(this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1] > breatstrokeAvaerage){
              if(i > 2){
                if(this.BreaststrokeArray[i-1].results[this.BreaststrokeArray[i].results.length - 1] > breatstrokeAvaerage)
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
                this.sendNotificationForTeamTarget(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
                this.sendNotificationForTeamTarget(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון ");
              }
            }else if(this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1] < breatstrokeAvaerage){
              if(i > 2){
                if(this.BreaststrokeArray[i-1].results[this.BreaststrokeArray[i].results.length - 1] < breatstrokeAvaerage)
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון " );
                this.sendNotificationForTeamTarget(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
                this.sendNotificationForTeamTarget(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
              }
            }
          }
      }

      var butterflyAvaerage = 0;
      for(var i = 0; i < this.ButterflyArray.length; i++){
        butterflyAvaerage += this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1];
          if(i == this.ButterflyArray.length -1){
            butterflyAvaerage = butterflyAvaerage / this.ButterflyArray.length;
            console.log("Butterfly Records Average :" + butterflyAvaerage);
            //Check if the last record is under or over the average
            if(this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1] > butterflyAvaerage){
              if(i > 2){
                if(this.ButterflyArray[i-1].results[this.ButterflyArray[i].results.length - 1] > butterflyAvaerage)
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
                this.sendNotificationForTeamTarget(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה האחרונים בסגנון ");
              }else{
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
                this.sendNotificationForTeamTarget(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
              }
            }else if(this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1] < butterflyAvaerage){
              if(i > 2){
                if(this.ButterflyArray[i-1].results[this.ButterflyArray[i].results.length - 1] < butterflyAvaerage)
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה  האחרונים בסגנון " );
                this.sendNotificationForTeamTarget(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה  האחרונים בסגנון ");
              }else{
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
                this.sendNotificationForTeamTarget(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
              }
            }
          }
      }

      var individualMedleyAvaerage = 0;
      for(var i = 0; i < this.IndividualMedleyArray.length; i++){
        individualMedleyAvaerage += this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1];
          if(i == this.IndividualMedleyArray.length -1){
            individualMedleyAvaerage = individualMedleyAvaerage / this.IndividualMedleyArray.length;
            console.log("Individual Medley Records Average :" + individualMedleyAvaerage);
            //Check if the last record is under or over the average
            if(this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1] > individualMedleyAvaerage){
              if(i > 2){
                if(this.IndividualMedleyArray[i-1].results[this.IndividualMedleyArray[i].results.length - 1] > individualMedleyAvaerage)
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה  האחרונים בסגנון ");
                this.sendNotificationForTeamTarget(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי הקבוצה  האחרונים בסגנון ");
              }else{
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
                this.sendNotificationForTeamTarget(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של הקבוצה בסגנון " );
              }
            }else if(this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1] < individualMedleyAvaerage){
              if(i > 2){
                if(this.IndividualMedleyArray[i-1].results[this.IndividualMedleyArray[i].results.length - 1] < individualMedleyAvaerage)
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה  האחרונים בסגנון " );
                this.sendNotificationForTeamTarget(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי הקבוצה  האחרונים בסגנון " );
              }else{
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
                this.sendNotificationForTeamTarget(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של הקבוצה בסגנון ");
              }
            }
          }
      }

    }else{
      var freestyleAvaerage = 0;
      for(var i = 0; i < this.FreestyleArray.length; i++){
          freestyleAvaerage += this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1];
          if(i == this.FreestyleArray.length -1){
            freestyleAvaerage = freestyleAvaerage / this.FreestyleArray.length;
            console.log("Freestyle Records Average :" + freestyleAvaerage);
            //Check if the last record is under or over the average
            if(this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1] > freestyleAvaerage){
              if(i > 2){
                if(this.FreestyleArray[i-1].results[this.FreestyleArray[i].results.length - 1] > freestyleAvaerage)
                console.log( " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון " + this.FreestyleArray[i-1].exercise_id.style);
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון " + this.FreestyleArray[i-1].exercise_id.style, this.FreestyleArray[i].swimmer._id)
              }else{
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " + this.FreestyleArray[i-1].exercise_id.style , this.FreestyleArray[i].swimmer._id)
              }
            }else if(this.FreestyleArray[i].results[this.FreestyleArray[i].results.length - 1] < freestyleAvaerage){
              if(i > 2){
                if(this.FreestyleArray[i-1].results[this.FreestyleArray[i].results.length - 1] < freestyleAvaerage)
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " + this.FreestyleArray[i-1].exercise_id.style , this.FreestyleArray[i].swimmer._id)
              }else{
                console.log(this.FreestyleArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון " + this.FreestyleArray[i-1].exercise_id.style , this.FreestyleArray[i].swimmer._id)
              }
            }
          }
      }


      var backstrokeAvaerage = 0;
      for(var i = 0; i < this.BackstrokeArray.length; i++){
        backstrokeAvaerage += this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1];
          if(i == this.BackstrokeArray.length -1){
            backstrokeAvaerage = backstrokeAvaerage / this.BackstrokeArray.length;
            console.log("Backstroke Records Average :" + backstrokeAvaerage);
            //Check if the last record is under or over the average
            if(this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1] > backstrokeAvaerage){
              if(i > 2){
                if(this.BackstrokeArray[i-1].results[this.BackstrokeArray[i].results.length - 1] > backstrokeAvaerage)
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון " + this.BackstrokeArray[i-1].exercise_id.style , this.BackstrokeArray[i].swimmer._id)
              }else{
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " + this.BackstrokeArray[i-1].exercise_id.style , this.BackstrokeArray[i].swimmer._id)
              }
            }else if(this.BackstrokeArray[i].results[this.BackstrokeArray[i].results.length - 1] < backstrokeAvaerage){
              if(i > 2){
                if(this.BackstrokeArray[i-1].results[this.BackstrokeArray[i].results.length - 1] < backstrokeAvaerage)
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " );
                this.sendNotificationForSwimmerTarget(" המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " + this.BackstrokeArray[i-1].exercise_id.style  , this.BackstrokeArray[i].swimmer._id)
              }else{
                console.log(this.BackstrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון " + this.BackstrokeArray[i-1].exercise_id.style , this.BackstrokeArray[i].swimmer._id)
              }
            }
          }
      }

      var breatstrokeAvaerage = 0;
      for(var i = 0; i < this.BreaststrokeArray.length; i++){
        breatstrokeAvaerage += this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1];
          if(i == this.BreaststrokeArray.length -1){
            breatstrokeAvaerage = breatstrokeAvaerage / this.BreaststrokeArray.length;
            console.log("Breastroke Average :" + breatstrokeAvaerage);
            //Check if the last record is under or over the average
            if(this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1] > breatstrokeAvaerage){
              if(i > 2){
                if(this.BreaststrokeArray[i-1].results[this.BreaststrokeArray[i].results.length - 1] > breatstrokeAvaerage)
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון ");
                this.sendNotificationForSwimmerTarget(" המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון " + this.BreaststrokeArray[i-1].exercise_id.style, this.BreaststrokeArray[i].swimmer._id)
              }else{
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " + this.BreaststrokeArray[i-1].exercise_id.style, this.BreaststrokeArray[i].swimmer._id)
              }
            }else if(this.BreaststrokeArray[i].results[this.BreaststrokeArray[i].results.length - 1] < breatstrokeAvaerage){
              if(i > 2){
                if(this.BreaststrokeArray[i-1].results[this.BreaststrokeArray[i].results.length - 1] < breatstrokeAvaerage)
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " );
                this.sendNotificationForSwimmerTarget(" המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " + this.BreaststrokeArray[i-1].exercise_id.style  , this.BreaststrokeArray[i].swimmer._id)
              }else{
                console.log(this.BreaststrokeArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון ");
                this.sendNotificationForSwimmerTarget(" המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון " + this.BreaststrokeArray[i-1].exercise_id.style , this.BreaststrokeArray[i].swimmer._id)
              }
            }
          }
      }

      var butterflyAvaerage = 0;
      for(var i = 0; i < this.ButterflyArray.length; i++){
        butterflyAvaerage += this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1];
          if(i == this.ButterflyArray.length -1){
            butterflyAvaerage = butterflyAvaerage / this.ButterflyArray.length;
            console.log("Butterfly Records Average :" + butterflyAvaerage);
            //Check if the last record is under or over the average
            if(this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1] > butterflyAvaerage){
              if(i > 2){
                if(this.ButterflyArray[i-1].results[this.ButterflyArray[i].results.length - 1] > butterflyAvaerage)
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין האחרונים בסגנון " + this.ButterflyArray[i-1].exercise_id.style, this.ButterflyArray[i].swimmer._id)
              }else{
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " + this.ButterflyArray[i-1].exercise_id.style, this.ButterflyArray[i].swimmer._id)
              }
            }else if(this.ButterflyArray[i].results[this.ButterflyArray[i].results.length - 1] < butterflyAvaerage){
              if(i > 2){
                if(this.ButterflyArray[i-1].results[this.ButterflyArray[i].results.length - 1] < butterflyAvaerage)
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי השחיין  האחרונים בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור משמעותי בהשיגי השחיין  האחרונים בסגנון " + this.ButterflyArray[i-1].exercise_id.style, this.ButterflyArray[i].swimmer._id)
              }else{
                console.log(this.ButterflyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון " + this.ButterflyArray[i-1].exercise_id.style, this.ButterflyArray[i].swimmer._id)
              }
            }
          }
      }

      var individualMedleyAvaerage = 0;
      for(var i = 0; i < this.IndividualMedleyArray.length; i++){
        individualMedleyAvaerage += this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1];
          if(i == this.IndividualMedleyArray.length -1){
            individualMedleyAvaerage = individualMedleyAvaerage / this.IndividualMedleyArray.length;
            console.log("Individual Medley Records Average :" + individualMedleyAvaerage);
            //Check if the last record is under or over the average
            if(this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1] > individualMedleyAvaerage){
              if(i > 2){
                if(this.IndividualMedleyArray[i-1].results[this.IndividualMedleyArray[i].results.length - 1] > individualMedleyAvaerage)
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין  האחרונים בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה מדאיגה בהשיגי השחיין  האחרונים בסגנון " + this.IndividualMedleyArray[i-1].exercise_id.style, this.IndividualMedleyArray[i].swimmer._id)
              }else{
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה ירידה בהישיג האחרון של השחיין בסגנון " + this.IndividualMedleyArray[i-1].exercise_id.style, this.IndividualMedleyArray[i].swimmer._id)
              }
            }else if(this.IndividualMedleyArray[i].results[this.IndividualMedleyArray[i].results.length - 1] < individualMedleyAvaerage){
              if(i > 2){
                if(this.IndividualMedleyArray[i-1].results[this.IndividualMedleyArray[i].results.length - 1] < individualMedleyAvaerage)
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " );
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור משמעותי בהשיגי השחיין האחרונים בסגנון " + this.IndividualMedleyArray[i-1].exercise_id.style, this.IndividualMedleyArray[i].swimmer._id)
              }else{
                console.log(this.IndividualMedleyArray[i-1].exercise_id.style + " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון ");
                this.sendNotificationForSwimmerTarget( " המערכת זיהתה שיפור בהישיג האחרון של השחיין בסגנון " + this.IndividualMedleyArray[i-1].exercise_id.style, this.IndividualMedleyArray[i].swimmer._id)
              }
            }
          }
      }

    }
  }

/**
 * sendNotificationForTeamTarget
 * @param tar 
 */
public sendNotificationForTeamTarget(body: string):void{
  if(body !== "" && body !== undefined){
    this.currentTeam.swimmers.forEach(swimmer =>{
      this.sendNotificationForSwimmerTarget(body, swimmer);
    })
  }else{
    return;
  }
}

  /**
   * sendNotification to swimmer about bad performances
   * @param target 
   */
  public sendNotificationForSwimmerTarget(body: any, swimmer_ref: string):void{
    //First create send notification to swimmer
    let notification = new NotificationModel();
    notification.type = NotificationTypeEnum.Warning;
    notification.coachmail = localStorage.getItem("email");
    notification.date = new Date();
    notification.message = body;
    notification.title = "תוצאות זיהוי השיגים אוטומטי על ידי המערכת"
    notification.priority = "analysis";
    notification.swimmer_id = swimmer_ref;
    notification.coachId = this.profileservice.profile._id;

    this.httpservice.httpPost('notification/setNotification', notification).subscribe(
      res =>{
        console.log(res);
      },
      err =>{
        this.OpenErrorDialogBox();
      }
    )
  }
  //#endregion

}
