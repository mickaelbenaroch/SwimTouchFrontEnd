import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent implements OnInit {

  //#region Public Members
  @Input() record: any;
  public graph: boolean;
  public lineChartData: any[] = [{ data: [],label: 'נגיעות'}];
  public lineChartLabels: any[] = [];


  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
       {
           display: true,
           //date font size
           ticks: {
             fontSize: 15
           }
       }
     ]
   }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black', 
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private dialogRef: MatDialogRef<RecordDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  public ngOnInit(): void {
    this.record = this.data.record;
    var distanceCounter = 25;
    this.record.results.forEach(res => {
      this.lineChartData[0].data.push(res);     
      this.lineChartLabels.push(distanceCounter + 'meters');
      distanceCounter += 25;
    });
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
   * ShowGraph
   */
  public ShowGraph():void{
    this.graph = true;
  }

  //#endregion

}
