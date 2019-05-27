import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MainPageComponent } from '../../main-page/main-page.component';

@Component({
  selector: 'app-generic-dialog-box',
  templateUrl: './generic-dialog-box.component.html',
  styleUrls: ['./generic-dialog-box.component.scss']
})
export class GenericDialogBoxComponent implements OnInit {

  //#region Public Members
  @Input() title: string;
  @Input() body: string;
  @Input() cancel: boolean;
  @Input() button: boolean;
  @Input() buttonText: string;
  public funct: boolean;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialogRef: MatDialogRef<GenericDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  public ngOnInit(): void {
    this.title = this.data.title;
    this.body = this.data.body;
    this.button = this.data.button;
    this.buttonText = this.data.buttonText;
    this.cancel = this.data.cancel;
  }
  //#endregion

  //#region Public Methods
  /**
   * Closes the dialog box
   */
  public close(): void {
      this.dialogRef.close();
  }

  /**
   * Close and send object to caller
   */
  public CloseAndSend():void{
    if(this.cancel){
      this.dialogRef.close("ok");
    }
  }
  //#endregion

}
