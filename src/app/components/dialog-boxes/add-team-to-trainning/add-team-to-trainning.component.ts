import { TeamModel } from '../../../models/TeamModel';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../../services/http-service/http-service.service';

@Component({
  selector: 'app-add-team-to-trainning',
  templateUrl: './add-team-to-trainning.component.html',
  styleUrls: ['./add-team-to-trainning.component.scss']
})
export class AddTeamToTrainningComponent implements OnInit {

  //#region Public Members
  @Input() coachmail: string;
  @Input() name: string;
  public teams: TeamModel[] = [];
  public teamChoosed: string;
  //#endregion

  //#region Constructor & Lifecycle Hoooks
  constructor( private httpservice: HttpService,
               @Inject(MAT_DIALOG_DATA) public data,
               private dialogRef: MatDialogRef<AddTeamToTrainningComponent>) { }

  public ngOnInit():void{
    this.coachmail = this.data.coachmail;
    this.name = this.data.name;
    if(this.coachmail !== undefined){
      this.httpservice.httpGet(this.httpservice.apiUrl + "team/getteams").subscribe(
        (res:any) =>{
          res.team.forEach(team => {
            if(team.coachmail == this.coachmail){
              this.teams.push(team);
            }
          });
        },
        err =>{
          console.log(err);
        }
      )
    }
  }
  //#endregion
  
  //#region Public Methods
  /**
   * On Mat select change handler
   */
  public Select(event):void{
    this.teamChoosed = event.value;
    console.log(this.teamChoosed)
  }

  /**
   * Add team to trainning
   */
  public AddTeam():void{
    this.dialogRef.close(this.teamChoosed);
  }

  /**
   * Close the box
   */
  public Close():void{
    this.dialogRef.close();
  }
  //#endregion
}
