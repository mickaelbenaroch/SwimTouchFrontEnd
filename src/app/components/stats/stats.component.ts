import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { RoleEnum } from '../../enums/roleenum';
import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { RecordModel } from '../../models/RecordModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { ExerciseModel } from '../../models/ExerciseModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TeamTargetModel } from '../../models/TeamTargetModel';
import { NotificationModel } from '../../models/NotificationModel';
import { SwimmerTargetModel } from '../../models/SwimmerTargetModel';
import { NotificationTypeEnum } from '../../enums/notificationtypeenum';
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
  public currentTeamTargets: TeamTargetModel[] = [];
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

  //#region Constructor & Lifecycle Hooks
  constructor( private dialog: MatDialog,
              private httpservice: HttpService,
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
              var tempSwimmers = [];
              this.teams[0].swimmers.forEach(swimmer =>{
                  this.httpservice.httpPost('swimmer/getswimmers', {_id: swimmer}).subscribe(
                    res =>{ tempSwimmers.push(res.swimmer[0])},
                    err =>{ this.OpenErrorDialogBox();}
                  )
              })
              this.teams[0].swimmers = tempSwimmers;
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
          if(res !== undefined && res.records !== undefined){
            res.records.forEach(rec => {
              this.teamRecords.push(rec);
            });
            console.log(this.teamRecords)
          }
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
        if(this.currentTeamTargets == undefined){
          return;
        }
        this.currentTeamTargets.forEach(tar =>{
              this.teamRecords.forEach(tr=>{
                if(((new Date(tr.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                   tr.exercise_id.style == tar.style && tr.exercise_id.distance == tar.distance && 
                   tr.results !== undefined &&
                   tr.results[tr.results.length - 1] > tar.targetTime ){
                     this.recorsNotBetterThanTargetForTeam.push(tr);
                     if(!tar.notification_has_been_send){
                      this.sendNotificationForTeamTarget(tar);
                      tar.notification_has_been_send = true;
                    }
    
                   }else if(((new Date(tr.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                   tr.exercise_id.style == tar.style && tr.exercise_id.distance == tar.distance && 
                   tr.results !== undefined &&
                   tr.results[tr.results.length - 1] <= tar.targetTime){
                      if(!tar.done){
                        this.updateTeamTarget(tar);
                        tar.done = true;
                      }
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
          records: this.records,
          target: target,
          button: true,
          buttonText: "הבנתי!"
        };
      }
      else{
        dialogConfig.data = {
          title: 'משחים שבהם היעד לא הושג על ידי: ' + this.currentSwimmer.name,
          records: this.records,
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
    public SwimmerDetails(event: any):void{
      var swimmer = event.value;
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
            if(this.currentSwimmerTargets == undefined){
              return;
            }
            this.currentSwimmerTargets.forEach(tar =>{
              if(!tar.done || tar.done){
                this.records.forEach(rec => {
                  if(((new Date(rec.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                       rec.exercise_id.style == tar.style &&
                       rec.exercise_id.distance == tar.distance &&
                       //rec.exercise_id.hasBeenStarted &&
                       rec.results !== undefined &&
                       rec.results[rec.results.length - 1] <= tar.targetTime){
                              if(!tar.done){
                                this.updateSwimmerTarget(tar);
                              }
                              tar.done = true;
                              this.recorsBetterThanTarget.push(rec);
                        }else if(((new Date(rec.exercise_id.date).getTime()) > (new Date(tar.date).getTime())) &&
                        rec.exercise_id.style == tar.style &&
                        rec.exercise_id.distance == tar.distance &&
                        rec.results !== undefined &&
                        rec.results[rec.results.length - 1] > tar.targetTime){
                          this.recorsNotBetterThanTarget.push(rec);
                          if(!tar.notification_has_been_send){
                            this.sendNotificationForSwimmerTarget(tar);
                            tar.notification_has_been_send = true;
                          }
                        }
                });
              }
            })
          },
          err =>{
            this.OpenErrorDialogBox();
          }
        )
      }
    }
  
  /**
   * sendNotificationForTeamTarget
   * @param tar 
   */
  public sendNotificationForTeamTarget(tar: TeamTargetModel):void{
    let model = {
      team_id: tar.team_id
    }
    this.httpservice.httpPost('team/getteamById',model).subscribe(
      res =>{
        res.team[0].swimmers.forEach(swimmer => {
          this.sendNotificationForSwimmerTarget(tar, swimmer);
        });
      },
      err =>{
        this.OpenErrorDialogBox();
      }
    )
  }
  
    /**
     * sendNotification to swimmer about bad performances
     * @param target 
     */
    public sendNotificationForSwimmerTarget(tar: any, swimmer_ref: string = null):void{
      //First create send notification to swimmer
      let notification = new NotificationModel();
      notification.type = NotificationTypeEnum.Warning;
      notification.coachmail = localStorage.getItem("email");
      notification.date = new Date();
      notification.message = "  נא לשים לב שהיעד הבא לא הושג " + tar.style + ' ' + tar.distance + ' מטר' + ' ,עליך לרדת מ: ' + tar.targetTime + 'שניות';
      notification.title = "הזהרה עקב אי עמידה ביעד שנקבע  לך על ידי המאמן!";
      notification.priority = "didnt_get_target_message";
      if(swimmer_ref == null){
        notification.swimmer_id = tar.swimmer_ref;
      }else{
        notification.swimmer_id = swimmer_ref;
      }
      notification.coachId = this.profileservice.profile._id;
  
      this.httpservice.httpPost('notification/setNotification', notification).subscribe(
        res =>{
          console.log(res);
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
  
  
      //second, update target notification
      let model = {
        _id: tar._id,
        notification_has_been_send: true,
        done: false
      }
      this.httpservice.httpPost('target/updateswimmertarget',model).subscribe(
        res =>{
          console.log();
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
    }
    
  
    /**
     * updateSwimmerTarget
     */
    public updateSwimmerTarget(target: SwimmerTargetModel):void{
      let model = {
        _id: target._id,
        notification_has_been_send: false,
        done: true
      }
      this.httpservice.httpPost('target/updateswimmertarget', model).subscribe(
        res =>{
            console.log(res);
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
    }
  
      /**
     * updateSwimmerTarget
     */
    public updateTeamTarget(target: TeamTargetModel):void{
      let model = {
        _id: target._id,
        notification_has_been_send: false,
        done: true
      }
      this.httpservice.httpPost('target/updateteamtarget', model).subscribe(
        res =>{
            console.log(res);
        },
        err =>{
          this.OpenErrorDialogBox();
        }
      )
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




