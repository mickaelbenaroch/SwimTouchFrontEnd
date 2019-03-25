import { PageEnum } from '../../enums/componentview';
import { SwimmerModel } from '../../models/SwimmerModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-my-swimmers',
  templateUrl: './my-swimmers.component.html',
  styleUrls: ['./my-swimmers.component.scss']
})
export class MySwimmersComponent implements OnInit {

  //#region Public Members
  @Output() GoBackEvent: EventEmitter<PageEnum> = new EventEmitter();
  public swimmers: SwimmerModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private httpservice: HttpService,
              private dialog: MatDialog) { }

  public ngOnInit(): void {
    var model = {
      coachmail: localStorage.getItem("email")
    }
    this.httpservice.httpPost('swimmer/getswimmers',model).subscribe(
      res =>{
        this.swimmers = res.swimmer;
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
   * Error dialog Box Opening
   * @param email 
   */
  public OpenDialog():void{

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
