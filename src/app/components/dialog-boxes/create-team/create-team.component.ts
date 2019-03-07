import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SwimmerModel } from '../../../models/SwimmerModel';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpService } from '../../../services/http-service.service';
import { CreateTrainningComponent } from '../create-trainning/create-trainning.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-create-team-box',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamBoxComponent implements OnInit {

  //#region Public Members
  @Input() name: string;
  public error: boolean;
  public swimmer: SwimmerModel = new SwimmerModel();
  public base64textString: string;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              private dialogRef: MatDialogRef<CreateTrainningComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialog: MatDialog,
              private spinerservice: NgxUiLoaderService) { }

  public ngOnInit(): void{
    this.name = this.data.name;
    this.swimmer.coachmail = localStorage.getItem("email");
  }
  //#endregion

  //#region Public Methods
   /**
   * Closes the dialog box
   */
  public Close(): void {
    this.dialogRef.close();
  }

  /**
   * Create Trainning 
   */
  public CreateTeam():void{
    if(this.swimmer.age == undefined || this.swimmer.age == null ||
       this.swimmer.group == undefined || this.swimmer.group == null ||
       this.swimmer.height == undefined || this.swimmer.height == null ||
       this.swimmer.name == undefined || this.swimmer.name == null){
         this.error = true;
       }
    else{
      this.spinerservice.start();
      this.httpservice.httpPost('swimmer',this.swimmer).subscribe(
        res =>{
          this.spinerservice.stop();
          this.swimmer._id = res.swimmer_id;
          this.dialogRef.close(this.swimmer);
        },
        err =>{
            this.spinerservice.stop();
            this.OpenDialog();
        }
      )
    }   
  }

  /**
   * Disable Error
   */
  public DisableError():void{
    if(this.error){
      this.error = false;
    }
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
      body: 'נא לנסות שוב!',
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}

   /**
    * Handle change select file input
    * @param event 
    */
   public handleFileSelect(event):void{
    //Reads the file bit by bit and save it into this.mp3 in base64 format 
    if (event.target.files && event.target.files[0]) {
     const reader = new FileReader();
     reader.onload = (event1: any) => {
       this.base64textString = event1.target.result;
       console.log(this.base64textString);
       this.swimmer.picture = this.base64textString;
     };
     reader.readAsDataURL(event.target.files[0]);
  }
 }

  //#endregion
}
