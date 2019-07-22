import { SwimmerModel } from '../../../models/SwimmerModel';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { SwimmerTargetModel } from '../../../models/SwimmerTargetModel';
import { HttpService } from '../../../services/http-service/http-service.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-add-swimmer-target',
  templateUrl: './add-swimmer-target.component.html',
  styleUrls: ['./add-swimmer-target.component.scss']
})
export class AddSwimmerTargetComponent implements OnInit {

  //#region Public Members
  @Input() swimmer: SwimmerModel;
  public target: SwimmerTargetModel = new SwimmerTargetModel();
  public styles: string[] = ['Freestyle','Backstroke','Breaststroke','Butterfly','Individual Medley'];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialog: MatDialog,
              private httpservice: HttpService,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<AddSwimmerTargetComponent>) { }

  public ngOnInit():void {
    this.swimmer = this.data.swimmer;
  }
  //#endregion

  //#region Public Methods
  /**
   * CLose the dialog box
   */
  public Close():void{
    this.dialogRef.close();
  }

  /**
   * AddSwimmerTarget
   */
  public AddSwimmerTarget():void{
    this.target.swimmer_ref = this.swimmer._id;
    this.target.date = new Date();
    this.httpservice.httpPost('target/swimmertarget',this.target).subscribe(
      res=>{
        console.log(res);
        this.OpenSuccesDialogBox();
      },
      err =>{
        this.OpenDialog();
      }
    )
  }

  /**
   * On Select stule change
   */
  public Select(event):void{
    this.target.style = event.value;
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
 * Open Succes box dialog
 */
public OpenSuccesDialogBox():void{
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title: "היעד נוצר בהצלחה ל- " + this.swimmer.name,
    body: 'באפשרותך לערוך אותו בכל רגע ',
    button: true,
    buttonText: "הבנתי!"
  };

  dialogConfig.width = "560px";
  dialogConfig.height = "272px";
  var ref = this.dialog.open(GenericDialogBoxComponent, dialogConfig);
  ref.afterClosed().subscribe(res => {
    this.dialogRef.close(this.target);
  })
  
}
  //#endregion

}
