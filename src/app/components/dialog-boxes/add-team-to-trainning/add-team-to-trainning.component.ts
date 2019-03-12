import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TeamModel } from '../../../models/TeamModel';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpService } from '../../../services/http-service/http-service.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-team-to-trainning',
  templateUrl: './add-team-to-trainning.component.html',
  styleUrls: ['./add-team-to-trainning.component.scss']
})
export class AddTeamToTrainningComponent implements OnInit {

  //#region Public Members
  @Input() coachmail: string;
  public teams: TeamModel[] = [];
  public teamChoosed: string;
  //#endregion

  //#region Constructor & Lifecycle Hoooks
  constructor( private dialog: MatDialog,
               private httpservice: HttpService,
               @Inject(MAT_DIALOG_DATA) public data,
               private spinnerservice: NgxUiLoaderService,
               private dialogRef: MatDialogRef<AddTeamToTrainningComponent>) { }

  public ngOnInit():void{
    this.coachmail = this.data.coachmail;
    if(this.coachmail !== undefined){
      this.spinnerservice.start();
      this.httpservice.httpPost('team/getteams', this.coachmail).subscribe(
        (res) =>{
          this.spinnerservice.stop();
          this.teams = res.team;
        },
        err =>{
          this.spinnerservice.stop();
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
