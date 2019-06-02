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
  public dateSort: boolean;
  public distanceSort: boolean;
  public styleSort: boolean;
  public timeSort: boolean;
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
      this.filteredRecords.push(rec);
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

  /**
   * Sort arrays of records
   */
  public Sort(sort: string):void{
    switch(sort){
      case 'date':
      if(!this.dateSort){
        this.filteredRecords = this.filteredRecords.sort((a,b)=>{
          if (a.date < b.date) //sort string ascending
           return -1;
          if (a.date > b.date)
           return 1;
          return 0; //default return value (no sorting)
        })
        this.dateSort = true;
      }else{
        this.filteredRecords = this.filteredRecords.sort((a,b)=>{
          if (a.date > b.date) //sort string ascending
           return -1;
          if (a.date < b.date)
           return 1;
          return 0; //default return value (no sorting)
        })
        this.dateSort = false;
      }
      break;
      case 'time':
          if(!this.timeSort){
            this.filteredRecords = this.filteredRecords.sort((a,b)=>{
              if (a.results[a.results.length -1] < b.results[b.results.length -1]) //sort string ascending
               return -1;
              else
               return 1;
            })
            this.timeSort = true;
          }else{
            this.filteredRecords = this.filteredRecords.sort((a,b)=>{
              if (a.results[a.results.length -1] > b.results[b.results.length -1]) //sort string ascending
              return -1;
             else
              return 1;
            })
            this.timeSort = false;
          }
      break;
      case 'style':
          if(!this.styleSort){
            this.filteredRecords = this.filteredRecords.sort((a, b) =>{
              var nameA = a.exercise_id.style.toLowerCase(), nameB = b.exercise_id.style.toLowerCase();
              if (nameA < nameB) //sort string ascending
               return -1;
              if (nameA > nameB)
               return 1;
              return 0; //default return value (no sorting)
            })
            this.styleSort = true;
          }else{
            this.filteredRecords = this.filteredRecords.sort((a,b)=>{
              var nameA = a.exercise_id.style.toLowerCase(), nameB = b.exercise_id.style.toLowerCase();
              if (nameA > nameB) //sort string ascending
               return -1;
              if (nameA < nameB)
               return 1;
              return 0; //default return value (no sorting)
            })
            this.styleSort = false;
          }
      break;
      case 'distance':
          if(!this.distanceSort){
            this.filteredRecords = this.filteredRecords.sort((a,b)=>{
              if (a.exercise_id.distance < b.exercise_id.distance) //sort string ascending
               return -1;
              if (a.exercise_id.distance > b.exercise_id.distance)
               return 1;
              return 0; //default return value (no sorting)
            })
            this.distanceSort = true;
          }else{
            this.filteredRecords = this.filteredRecords.sort((a,b)=>{
              if (a.exercise_id.distance > b.exercise_id.distance) //sort string ascending
               return -1;
              if (a.exercise_id.distance < b.exercise_id.distance)
               return 1;
              return 0; //default return value (no sorting)
            })
            this.distanceSort = false;
          }
      break;    
    }
  }
  //#endregion
}
