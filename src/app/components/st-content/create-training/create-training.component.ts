import { Component, OnInit, ɵConsole } from '@angular/core';
import { ExerciseModel } from '../../../models/ExerciseModel';
import { TrainningModel } from 'src/app/models/TrainningModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ExerciseTypeEnum } from '../../../enums/exercisetypeenum';
import { NotificationModel } from '../../../models/NotificationModel';
import { NotificationTypeEnum } from '../../../enums/notificationtypeenum';
import { HttpService } from '../../../services/http-service/http-service.service';
import { CreateTrainningComponent } from '../../dialog-boxes/create-trainning/create-trainning.component';
import { GenericDialogBoxComponent } from '../../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddTeamToTrainningComponent } from '../../dialog-boxes/add-team-to-trainning/add-team-to-trainning.component';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {

  //#region Public Members
  public trainnningModel: TrainningModel = new TrainningModel();
  public exerciceModel: ExerciseModel[] = [];
  public error: boolean;
  public warmupcount: number = 0;
  public buildupcount: number = 0;
  public corecount: number = 0;
  public warmdowncount: number = 0;
  public warmuparray: ExerciseModel[] = [];
  public builduparray: ExerciseModel[] = [];
  public corearray: ExerciseModel[] = [];
  public warmdownarray: ExerciseModel[] = [];
  public wurepeat: number = 1;
  public burepeat: number = 1;
  public corepeat: number = 1;
  public wdrepeat: number = 1;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor( private dialog: MatDialog,
               private httpservice: HttpService) { }

  public ngOnInit(): void {
    this.trainnningModel.coachmail = localStorage.getItem("email");
  
  }
  //#endregion

  //#region Public Methods
  /**
   * Open create trainning dialog box
   */
  public OpenCreateBox():void{
    if(this.error){
      this.error = false;
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      name: this.trainnningModel.name,
      team: this.trainnningModel.team_id._id,
      date: this.trainnningModel.date
    };
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    setTimeout(()=>{
      var dialogRef = this.dialog.open(CreateTrainningComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        (data: ExerciseModel) => {
          if(data !== undefined){
            console.log("Dialog output:", data);
            switch(data.type){
              case ExerciseTypeEnum.WarmUp:
              this.warmupcount+=data.distance;
              this.warmuparray.push(data);
              break;
              case ExerciseTypeEnum.BuildUp:
              this.buildupcount+=data.distance;
              this.builduparray.push(data);
              break;
              case ExerciseTypeEnum.Core:
              this.corecount+=data.distance;
              this.corearray.push(data);
              break;
              case ExerciseTypeEnum.WarmDown:
              this.warmdowncount+=data.distance;
              this.warmdownarray.push(data);
              break;
            }
            this.trainnningModel.exercises.push(data);
            this.exerciceModel.push(data);
          }
        }); 
    })
  }

  /**
   * Save Trainning
   */
  public SaveTrainning():void{
    if(this.trainnningModel.coachmail !== undefined && this.trainnningModel.coachmail !== null &&
       this.trainnningModel.name !== undefined && this.trainnningModel.name !== null &&
       this.trainnningModel.team_id !== undefined && this.trainnningModel.team_id !== null &&
       this.trainnningModel.date !== undefined && this.trainnningModel.date !== null){
         this.OpenSureToSaveBox();
       }else{
         this.error = true;
       }

  }

  /**
   * Disable Error on input change
   */
  public DisableError():void{
    if(this.error){
      this.error = false;
    }
  }

/**
 * Repeat set
 */
public Repeat(str: string):void{
  switch(str){
    case 'warmup':
    this.warmuparray.forEach(ex =>{
      this.httpservice.httpPost('exercise',ex).subscribe(
        res =>{
           this.trainnningModel.exercises.push(ex);
           this.trainnningModel.exercisesCount += 1;
           this.wurepeat += 1;
           this.warmupcount += ex.distance;
        },
        err =>{
          console.log(err);
          this.OpenDialog();
        }
      )
    })
    break;
    case 'buildup':
    this.warmuparray.forEach(ex =>{
      this.httpservice.httpPost('exercise',ex).subscribe(
        res =>{
           this.trainnningModel.exercises.push(ex);
           this.trainnningModel.exercisesCount += 1;
           this.burepeat += 1;
           this.buildupcount += ex.distance;
        },
        err =>{
          console.log(err);
          this.OpenDialog();
        }
      )
    })
    break;
    case 'core':
    this.warmuparray.forEach(ex =>{
      this.httpservice.httpPost('exercise',ex).subscribe(
        res =>{
           this.trainnningModel.exercises.push(ex);
           this.trainnningModel.exercisesCount += 1;
           this.corepeat += 1;
           this.corecount += ex.distance;
        },
        err =>{
          console.log(err);
          this.OpenDialog();
        }
      )
    })
    break;
    case 'warmdown':
    this.warmuparray.forEach(ex =>{
      this.httpservice.httpPost('exercise',ex).subscribe(
        res =>{
           this.trainnningModel.exercises.push(ex);
           this.trainnningModel.exercisesCount += 1;
           this.wdrepeat += 1;
           this.warmdowncount += ex.distance;
        },
        err =>{
          console.log(err);
          this.OpenDialog();
        }
      )
    })
    break;
  }
}

/**
 * Open generic box Sure To Save trainning?
 */
public OpenSureToSaveBox():void{
  const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'האם הינך בטוח לשמור את האימון?',
      body: 'אם כן, לחץ על שמור, אחרת לחץ על X',
      button: true,
      buttonText: "שמור",
      cancel: true
    };
    dialogConfig.width = "500px";
    dialogConfig.height = "250px";
    var dialogRef = this.dialog.open(GenericDialogBoxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (res:string)=>{
        this.trainnningModel.exercisesCount = this.warmdownarray.length + this.warmuparray.length + this.builduparray.length + this.corearray.length;
        this.trainnningModel.distance = this.warmupcount + this.buildupcount + this.corecount + this.warmdowncount;
        if(res !== null && res!== undefined && res == "ok"){
          this.httpservice.httpPost('trainning',this.trainnningModel).subscribe(
            res =>{
              //Send notification to swimmers
              this.SendNotificationToSwimmers();
              this.OpenSuccesDialogBox();
              console.log(res);
            },
            err =>{
              console.log(err);              
              this.OpenDialog();
            }
          )
        }
      })
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
      body: 'הפרטים שהוזנו אינם נכונים, נסה שוב!',
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}

/**
 * Open Addd swimmers box
 */
public OpenAddTeamBox():void{
      setTimeout(()=>{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          coachmail: this.trainnningModel.coachmail,
          team: this.trainnningModel.team_id
        };
        dialogConfig.width = "600px";
        dialogConfig.height = "50%";
        var dialogRef = this.dialog.open(AddTeamToTrainningComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          res => {
            this.trainnningModel.team_id = res;
          }
        );
      },100)
}
 
/**
 * Open Succes box dialog
 */
public OpenSuccesDialogBox():void{
    const dialogConfig = new MatDialogConfig();
  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title:   ' האימון ' + this.trainnningModel.name + ' נשמר בהצלחה ',
      body: 'באפשרותך לערוך אותו בכל רגע ',
      button: true,
      buttonText: "הבנתי!"
    };

    dialogConfig.width = "560px";
    dialogConfig.height = "272px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
}

/**
 * Sends Notifications to swimmers in the trainning
 */
public SendNotificationToSwimmers():void{
  var swimmers = [];
  //SEND TO BACKEND NOTIFICATIONS TO SWIMMERS
  this.trainnningModel.exercises.forEach(exercise =>{
      exercise.routes.routes.forEach(route =>{
        swimmers.push(route.swimmer_id);
      })
    });
    var uniqueNames = [];
    $.each(swimmers, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    uniqueNames.forEach(swimmer =>{
      //send notification to each swimmer in the trainning;
      let notification = new NotificationModel();
      notification.type = NotificationTypeEnum.Message;
      notification.coachmail = this.trainnningModel.coachmail;
      notification.date = new Date();
      notification.swimmer_id = swimmer;
      notification.priority = "warning";
      notification.message = "הוזמנת להשתתף באימון " + this.trainnningModel.name + "בתאריך " + this.trainnningModel.date + "תוכל לראות את פרטי האימון בלוח המחוונים שלך. בהצלחה!";
      this.httpservice.httpPost('notification/setNotification', notification).subscribe(
        res =>{
          console.log(res);
        },
        err =>{
          this.OpenDialog();
        }
      )
    })
}
  //#endregion
}
