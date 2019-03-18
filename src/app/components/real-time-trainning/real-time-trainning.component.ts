import { Component, OnInit } from '@angular/core';
import { ExerciseModel } from '../../models/ExerciseModel';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RealTrainningEnum } from '../../enums/realtrainningenum';
import { HttpService } from '../../services/http-service/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-real-time-trainning',
  templateUrl: './real-time-trainning.component.html',
  styleUrls: ['./real-time-trainning.component.scss']
})
export class RealTimeTrainningComponent implements OnInit {
  
   //#region Public Members
   public trainnings: TrainningModel[] = [];
   public stateHelper = RealTrainningEnum;
   public state: RealTrainningEnum = RealTrainningEnum.TrainningView;
   public choosenTrainning: TrainningModel;
   public choosenExercise: ExerciseModel;
   public temp: string[] = [];
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
    * Choose a specific Exercise
    * @param trainning 
    */
   public ChooseExercise(exercise: ExerciseModel):void{
      console.log(exercise);
      this.choosenExercise = exercise;
      for(let i = 0; i<this.choosenExercise.howMuchTouches; i++)
        this.temp.push('temp');
      this.state = RealTrainningEnum.RealTimeView;
   }
   /**
    * Get the choosed trainning
    */ 
   public ChooseTrainning(trainning: TrainningModel){
     console.log(trainning);
     this.choosenTrainning = trainning;  
     this.state = RealTrainningEnum.ExerciseView;
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
   //#endregion
  
}
