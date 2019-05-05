import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { RecordModel } from '../../models/RecordModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { ExerciseModel } from '../../models/ExerciseModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SwimmerTargetModel } from '../../models/SwimmerTargetModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddSwimmerTargetComponent } from '../dialog-boxes/add-swimmer-target/add-swimmer-target.component';
import { RoleEnum } from 'src/app/enums/roleenum';

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
  public targ: boolean;
  public choosenSwimmer: boolean;
  public currentSwimmer: SwimmerModel;
  public SwimmerTargetModel: SwimmerTargetModel;
  public currentSwimmerTargets: SwimmerTargetModel[] = [];
  public specificRecords: RecordModel[] = [];
  public choosenTarget: SwimmerTargetModel;
  public targetChoosen: boolean;
  public AllExerices: ExerciseModel[] = [];
  public graphReady: boolean;
  public notification: boolean;
  public message: string;

  //chart
  public lineChartData: any[] = [
    { data: [], label: 'הישיגים' },
  ];
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

  //#regiom Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog,
              private profileservice: ProfileServiceService ) { }

  public ngOnInit():void {
  
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
  //the user is a swimmer
  else{
    let swimmerName = {
      name: this.profileservice.profile.first_name + ' ' + this.profileservice.profile.last_name
    }
    this.httpservice.httpPost('swimmer/getswimmers',swimmerName).subscribe(
      res =>{
          let idOfSwimmer = {
            swimmer_id: res.swimmer[0]._id
          }
          this.httpservice.httpPost('team/getSwimmerTeams',idOfSwimmer).subscribe(
            res =>{
              this.teams = res.teams;
            },
            err =>{
              this.OpenErrorDialogBox();
            }
          )
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
 * Enter to Target details on click
 */
public EnterTarget(target: SwimmerTargetModel):void{
  this.targetChoosen = true;
  this.targ = false;
  this.choosenTarget = target;
  var model = {
    swimmer_id: this.currentSwimmer._id
  }

  //First getting all the records of the choosen swimmer
  this.httpservice.httpPost('statistic/full_records', model).subscribe(
    res =>{
      console.log(res.records);
      res.records.forEach(rec => { 
        console.log(new Date(rec.exercise_id.date).getTime() + " - " + new Date(this.choosenTarget.date).getTime() )
        if(((new Date(rec.exercise_id.date).getTime()) > (new Date(this.choosenTarget.date).getTime())) &&
          rec.exercise_id.style == this.choosenTarget.style &&
          rec.exercise_id.distance == this.choosenTarget.distance.toString() 
          /* && rec.exercise_id.hasBeenStarted */){
            let newRecord = new RecordModel();
            newRecord.date = rec.exercise_id.date;
            newRecord.style = rec.exercise_id.style.toString();
            newRecord = rec;
            this.specificRecords.push(newRecord);
            this.lineChartData[0].data.push(rec.results[rec.results.length - 1]);
            this.lineChartData[0].label = rec.exercise_id.style;
            this.lineChartLabels.push(rec.date.substring(0,10));
          }
      });
      this.graphReady = true;
      this.DoStatisticsForSwimmerResult();
    },
    err =>{
      this.OpenErrorDialogBox();
      console.log(err);
    }
  )
}

  /**
   * On card selction give animation
   * @param event 
   */
  public ShowSelectedCard(target: SwimmerTargetModel):void{
    target.selected = true;
  }

  /* On card deselction hide animation
  * @param event 
  */
 public HideSelectedCard(target: SwimmerTargetModel):void{
   target.selected = false;
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
    console.log(swimmer);
    this.choosenSwimmer = true;
    this.currentSwimmer = swimmer;

  }

  /**
   * BackToSwimmerChoose
   */
  public BackToSwimmerChoose():void{
    this.choosenSwimmer = false;
    if(this.targ){
      this.targ = false;
    }
  }

  /**
   * GetSwimmerTargets
   */
  public GetSwimmerTargets(): void{
    if(this.currentSwimmer == null || this.currentSwimmer == undefined){
      return;
    }else{
      console.log(this.currentSwimmer._id)
      var model = {
        swimmer_ref: this.currentSwimmer._id
      }
      this.httpservice.httpPost('target/getswimmertarget', model).subscribe(
        res => {
          console.log(res);
          this.targ = true;
          this.currentSwimmerTargets = res.target;
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
    }
  }

  /**
   * Makes StatisticsForSwimmerResult
   */
  public DoStatisticsForSwimmerResult():void{
    if(this.specificRecords !== undefined && this.specificRecords.length >= this.choosenTarget.triesToImprove){
      this.specificRecords.forEach((rec:any) => {
        if(rec.results[rec.results.length - 1] > this.choosenTarget.targetTime){
          this.notification = true;
          this.message = "המערכת זיהתה אי עמידה ביעד, על בשחיין להשתפר!  תישלח לו התראה על כך."
          this.OpenNotificationDialog(this.message);
          return;
        }
      })
    }
  }

  /**
   * OpenAddSwimmerTarget
   */
  public OpenAddSwimmerTarget():void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      swimmer: this.currentSwimmer
    };
    dialogConfig.width = "500px";
    dialogConfig.height = "500px";
    this.dialog.open(AddSwimmerTargetComponent, dialogConfig);
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
  public OpenNotificationDialog(message: string):void{
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'התראה!',
      body: message,
      button: false,
    };
    dialogConfig.width = "520px";
    dialogConfig.height = "350px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  }
  //#endregion
}
