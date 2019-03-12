import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/TeamModel';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HttpService } from '../../services/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog,
              private spinnerservice: NgxUiLoaderService) { }

  public ngOnInit(): void {
    this.spinnerservice.start();
    var model = {
      coachmail: localStorage.getItem("email")
    }
    this.httpservice.httpPost('team/getteams',model).subscribe(
      res =>{
        this.spinnerservice.stop();
        this.teams = res.team;
      },
      err =>{
        this.spinnerservice.stop();
      }
    )
  }
  //#endregion

  //#region Public Methods
      /**
   * Error dialog Box Opening
   * @param email 
   */
  public OpenDialog() {

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
