import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TeamModel } from '../../../models/TeamModel';
import { HttpService } from '../../../services/http-service/http-service.service';
import { ProfileServiceService } from '../../../services/profile-service/profile-service.service';

@Component({
  selector: 'app-best-records-box',
  templateUrl: './best-records-box.component.html',
  styleUrls: ['./best-records-box.component.scss']
})
export class BestRecordsBoxComponent implements OnInit {

   //#region Public Members
   public teams: TeamModel[] = [];
   public records: any[] = []   
   @Output() GoToStatsEventFromSon: EventEmitter<boolean> = new EventEmitter();
   //#endregion
 
   //#region Constructor & Lyfecycle Hooks
   constructor(public httpservice: HttpService,
               public profileservice: ProfileServiceService) { }
 
   public ngOnInit(): void {
    this.httpservice.httpPost('swimmer/getswimmers',{name: this.profileservice.profile.first_name + ' ' + this.profileservice.profile.last_name}).subscribe(
        res =>{
          let idOfSwimmer = {
            swimmer_id: res.swimmer[0]._id
          }
          this.httpservice.httpPost('statistic/full_records', idOfSwimmer).subscribe(
            res => {
              this.records = res.records;
            }
          )
        },
        err =>{ console.log(err)}
    )
   }
   //#endregion
 
   //#region Public Methods
   /**
    * GoToStats event sending
    */
   public GoToStats():void{debugger
      this.GoToStatsEventFromSon.emit(true);
   }
   //#endregion
}
