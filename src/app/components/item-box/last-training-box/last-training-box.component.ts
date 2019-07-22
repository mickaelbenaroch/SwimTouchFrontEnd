import { ChartOptions, ChartType } from 'chart.js';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TrainningModel } from '../../../models/TrainningModel';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend } from 'ng2-charts';
import { HttpService } from '../../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-last-training-box',
  templateUrl: './last-training-box.component.html',
  styleUrls: ['./last-training-box.component.scss']
})
export class LastTrainingBoxComponent implements OnInit {

  //#region Public Members
  @Output() GoToStatsEvent: EventEmitter<boolean> = new EventEmitter();
  public trainnings: TrainningModel[] = [];
   // Pie
   public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: any[] = [];
  public pieChartData: any[] = [];;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public donutColors = [
    {
      backgroundColor: [
        'rgba(110, 114, 20, 1)',
        'rgba(118, 183, 172, 1)',
        'rgba(0, 148, 97, 1)',
        'rgba(129, 78, 40, 1)',
        'rgba(129, 199, 111, 1)'
    ]
    }
  ];

  //#endregion

  //#region Constructor & Lifecycle Hooks
  public constructor(public httpservice: HttpService,
                     public dialog: MatDialog) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  
  public ngOnInit():void {
    var model = {
      coachmail: localStorage.getItem("email")
    }
    this.httpservice.httpPost('trainning/getTrainnings',model).subscribe(
      res =>{
        this.trainnings = res.trainning.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        var newest = this.trainnings[0];
        this.httpservice.httpPost('records/getrecord',{exercise_id: "f78520a0-a111-4327-89fc-f55995fb6fc9"}).subscribe(
          res=>{
            if(res.isTrue){
              res.isTrue.forEach(rec =>{
                var tt = rec.swimmer.swimmer_ref.split(' ');
                let lab = [];
                lab.push(tt[0]);
                lab.push(tt[1]);
                this.pieChartData.push(rec.results[rec.results.length -1]);
                this.pieChartLabels.push(lab);
              })
            }
          },
          err =>{
            console.log(err);
            this.OpenDialog();
          }
          )
        },
        err =>{
          this.OpenDialog();
          console.log(err);      
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

/**
 * GoToStats
 */
public GoToStats():void{
  this.GoToStatsEvent.emit(true);
}
  //#endregion

}
