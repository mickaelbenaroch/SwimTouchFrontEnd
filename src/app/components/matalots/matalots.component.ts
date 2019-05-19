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
  public recorsBetterThanTarget: any[] = [];
  public recorsNotBetterThanTarget: any[] = [];
  public recorsBetterThanTargetForTeam: any[] = [];
  public recorsNotBetterThanTargetForTeam: any[] = [];

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
