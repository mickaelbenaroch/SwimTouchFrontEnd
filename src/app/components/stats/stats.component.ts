import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { RoleEnum } from '../../enums/roleenum';
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { RecordModel } from '../../models/RecordModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { ExerciseModel } from '../../models/ExerciseModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SwimmerTargetModel } from '../../models/SwimmerTargetModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { TargetDetailsComponent } from '../dialog-boxes/target-details/target-details.component';
import { AddTeamTargetComponent } from '../dialog-boxes/add-team-target/add-team-target.component';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddSwimmerTargetComponent } from '../dialog-boxes/add-swimmer-target/add-swimmer-target.component';
import { TeamTargetDetailsComponent } from '../dialog-boxes/team-target-details/team-target-details.component';

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
  public currentTeamTargets: SwimmerTargetModel[] = [];
  public specificRecords: RecordModel[] = [];
  public choosenTarget: SwimmerTargetModel;
  public targetChoosen: boolean;
  public AllExerices: ExerciseModel[] = [];
  public graphReady: boolean;
  public notification: boolean;
  public message: string;
  public teamChoosen: boolean;
  public records: any;
  public recorsBetterThanTarget: any[] = [];
  public recorsNotBetterThanTarget: any[] = [];
  public teamRecords:any[] = [];
  public recorsBetterThanTargetForTeam: any[] = [];
  public recorsNotBetterThanTargetForTeam: any[] = [];
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
 * AllTheTeamChoosen, gets from backend all the swimmers of team record
 * @param target 
 */
public AllTheTeamChoosen():void{
  this.teamChoosen = true;
  this.choosenSwimmer = true;
  this.currentTeam.swimmers.forEach((swimmer: any) =>{
    this.httpservice.httpPost('statistic/full_records',{swimmer_id: swimmer._id}).subscribe(
      res =>{
        res.records.forEach(rec => {
          this.teamRecords.push(rec);
        });
        console.log(this.teamRecords)
      },
      err =>{
        this.OpenErrorDialogBox();
      }
    )
  })
}

/**
 * GetTeamTargets
 * @param target 
 */
public GetTeamTargets():void{

  let model = {
    team_id: this.currentTeam._id
  }
  this.httpservice.httpPost('target/getteamtarget', model).subscribe(
    res => {
      console.log(res.target);
      this.currentTeamTargets = res.target;
      this.currentTeamTargets.forEach(tar =>{
          this.teamRecords.forEach(tr=>{debugger
            if(((new Date(tr.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
               tr.exercise_id.style == tar.style && tr.exercise_id.distance == tar.distance && 
               tr.results !== undefined &&
               tr.results[tr.results.length - 1] > tar.targetTime ){
                 this.recorsNotBetterThanTargetForTeam.push(tr);

               }else if(((new Date(tr.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
               tr.exercise_id.style == tar.style && tr.exercise_id.distance == tar.distance && 
               tr.results !== undefined &&
               tr.results[tr.results.length - 1] <= tar.targetTime){
                  tar.done = true;
                  this.recorsBetterThanTargetForTeam.push(tr);
               }
          })
      })
    }
  )
}

/**
 * OpenAddTeamTarget
 * @param target 
 */
public OpenAddTeamTarget():void{
  $(".button-3").css('background-color','#ccffe6');
  $(".button-4").css('background-color','transparent');
  const dialogConfig = new MatDialogConfig();
  
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    team: this.currentTeam
  };
  dialogConfig.width = "500px";
  dialogConfig.height = "500px";
  this.dialog.open(AddTeamTargetComponent, dialogConfig);
}

/**
 * Enter to Target details on click
 */
public EnterTarget(target: SwimmerTargetModel):void{
    this.targetChoosen = true;
    //this.targ = false;
    this.choosenTarget = target;
    const dialogConfig = new MatDialogConfig(); 
      
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if(target.done){
      dialogConfig.data = {
        title: 'משחים שבהם היעד הושג על ידי: ' + this.currentSwimmer.name,
        records: this.recorsBetterThanTarget,
        target: target,
        button: true,
        buttonText: "הבנתי!"
      };
    }else{
      dialogConfig.data = {
        title: 'משחים שבהם היעדלא הושג על ידי: ' + this.currentSwimmer.name,
        records: this.recorsNotBetterThanTarget,
        button: true,
        target:target,
        buttonText: "הבנתי!",
        bad: true, 
      }
    }
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    this.dialog.open(TargetDetailsComponent, dialogConfig);
}

/**
 * Enter to Target details on click
 */
public EnterTeamTarget(target: SwimmerTargetModel):void{
  this.targetChoosen = true;
  //this.targ = false;
  this.choosenTarget = target;
  const dialogConfig = new MatDialogConfig(); 
    
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  if(target.done){
    dialogConfig.data = {
      title: 'משחים שבהם היעד הושג על ידי קבוצת : ' + this.currentTeam.name,
      records: this.recorsBetterThanTargetForTeam,
      target: target,
      button: true,
      buttonText: "הבנתי!"
    };
  }else{
    dialogConfig.data = {
      title: 'משחים שבהם היעד הושג על ידי קבוצת : '  + this.currentTeam.name,
      records: this.recorsNotBetterThanTargetForTeam,
      button: true,
      target:target,
      buttonText: "הבנתי!",
      bad: true, 
    }
  }
  dialogConfig.width = "80%";
  dialogConfig.height = "80%";
  this.dialog.open(TeamTargetDetailsComponent, dialogConfig);
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
    this.teamChoosen = false;
    this.currentSwimmer = swimmer;
    var model = {
      swimmer_id: this.currentSwimmer._id
    }
    //First getting all the records of the choosen swimmer
    this.httpservice.httpPost('statistic/full_records', model).subscribe(
        res=>{
            this.records = res.records;
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
   * GetSwimmerTargets
   */
  public GetSwimmerTargets(): void{
    $(".button-1").css('background-color','#ccffe6');
    $(".button-2").css('background-color','transparent');
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
          this.currentSwimmerTargets.forEach(tar =>{debugger;
            this.records.forEach(rec => {
              if(((new Date(rec.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                   rec.exercise_id.style == tar.style &&
                   rec.exercise_id.distance == tar.distance &&
                   rec.exercise_id.hasBeenStarted &&
                   rec.results !== undefined &&
                   rec.results[rec.results.length - 1] <= tar.targetTime){debugger;
                          tar.done = true;
                          this.recorsBetterThanTarget.push(rec);
                    }else if(((new Date(rec.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                    rec.exercise_id.style == tar.style &&
                    rec.exercise_id.distance == tar.distance &&
                    rec.results !== undefined &&
                    rec.results[rec.results.length - 1] > tar.targetTime){
                      this.recorsNotBetterThanTarget.push(rec);
                    }
            });
          })
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
    $(".button-2").css('background-color','#ccffe6');
    $(".button-1").css('background-color','transparent');
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




// date: "2019-05-07T00:00:00.000Z"
// exercise_id:
// coach: "mickaelbenaroch@yahoo.fr"
// date: "2019-05-07T00:00:00.000Z"
// description: "test"
// distance: 50
// group: "A"
// hasBeenStarted: true
// howMuchTouches: 2
// repeat: 1
// routes: {routes: Array(3)}
// singleSwimDistance: 50
// style: "Freestyle"
// type: "Warm UP"
// _id: "ac562930-9a91-43e1-846e-2339dfb8241f"
// __proto__: Object
// jump_time: 0
// results: (2) [1.003, 2.003]
// swimmer: {_id: "fc562845-ea5a-4232-aebe-167a39aa2471", name: "פרניל בלום", height: "187", group: "A", age: "32", …}
// _id: "5cd077c66b29262bcb3f19d5"