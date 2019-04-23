import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { RecordModel } from '../../models/RecordModel';
import { SwimmerModel } from '../../models/SwimmerModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SwimmerTargetModel } from '../../models/SwimmerTargetModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddSwimmerTargetComponent } from '../dialog-boxes/add-swimmer-target/add-swimmer-target.component';

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
  //#endregion

  //#regiom Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog ) { }

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
        this.OpenErrorDialogBox();      
      }
    )
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
    swimmer_ref: this.currentSwimmer._id
  }
  this.httpservice.httpPost('statistic/swimmer', model).subscribe(
    res =>{
      console.log(res);
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

  //#endregion
}
