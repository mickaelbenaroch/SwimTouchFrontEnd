import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { HttpService } from '../../services/http-service/http-service.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-my-trainnings',
  templateUrl: './my-trainnings.component.html',
  styleUrls: ['./my-trainnings.component.scss']
})
export class MyTrainningsComponent implements OnInit {

  //#region Public Members
  public trainnings: TrainningModel[] = [];
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
    this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
      res =>{
        this.spinnerservice.stop();
        this.trainnings = res.trainning;
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
