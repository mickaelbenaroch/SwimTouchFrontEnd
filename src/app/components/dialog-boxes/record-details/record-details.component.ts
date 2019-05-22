import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent implements OnInit {

  //#region Public Members
  @Input() record: any;
  
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialogRef: MatDialogRef<RecordDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  public ngOnInit(): void {
    this.record = this.data.record;
  }
  //#endregion

  //#region Public Methods
  /**
   * Closes the dialog box
   */
  public Close(): void {
      this.dialogRef.close();
  }

  //#endregion

}
