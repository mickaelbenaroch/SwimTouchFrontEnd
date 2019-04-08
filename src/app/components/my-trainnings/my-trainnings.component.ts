import { PageEnum } from '../../enums/componentview';
import { TrainningModel } from '../../models/TrainningModel';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-my-trainnings',
  templateUrl: './my-trainnings.component.html',
  styleUrls: ['./my-trainnings.component.scss']
})
export class MyTrainningsComponent implements OnInit {

  //#region Public Members
  @Output() GoBackEvent: EventEmitter<PageEnum> = new EventEmitter();
  public trainning: TrainningModel;
  public trainnings: TrainningModel[] = [];
  public details: boolean;
  public refill: boolean = false;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog) { }

  public ngOnInit(): void {
    var model = {
      coachmail: localStorage.getItem("email")
    }
    this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
      res =>{
        this.trainnings = res.trainning;
      },
      err =>{
        console.log(err);      }
    )
  }
  //#endregion

  //#region Public Methods
  /**
   * Go back to main page
   */
  public GoBack(): void{
    this.GoBackEvent.emit(PageEnum.Landing);
  }

  /**
   * Go back to calendar
   */
  public Back():void{
    this.details = false;
    this.refill = true;
  }
  
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

/**
 * Get current trainning details for son component
 */
public GetCurrentTrainning(event: TrainningModel):void{
  if(event !== null && event !== undefined){
    this.details = true;
    this.trainning = event;
  }
}
  //#endregion
}
