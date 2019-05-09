import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwimmerTargetModel } from '../../../models/SwimmerTargetModel';

@Component({
  selector: 'app-target-details',
  templateUrl: './target-details.component.html',
  styleUrls: ['./target-details.component.scss']
})
export class TargetDetailsComponent implements OnInit {

  
  //#region Public Members
  @Input() title: string;
  @Input() records: any[] = [];
  @Input() cancel: boolean;
  @Input() button: boolean;
  @Input() buttonText: string;
  @Input() target: SwimmerTargetModel;
  @Input() bad: boolean;
  public filteredRecords: any[] = []
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialogRef: MatDialogRef<TargetDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  public ngOnInit(): void {
    this.title = this.data.title;
    this.records = this.data.records;
    this.button = this.data.button;
    this.buttonText = this.data.buttonText;
    this.cancel = this.data.cancel;
    this.target = this.data.target;
    this.bad = this.data.bad;
    this.records.forEach(rec =>{
      if(rec.exercise_id !== undefined && rec.exercise_id.style == this.target.style && rec.exercise_id.distance == this.target.distance){
        this.filteredRecords.push(rec);
      }
    })
    
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
