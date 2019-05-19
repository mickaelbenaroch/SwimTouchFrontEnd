import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../../models/TeamModel';

@Component({
  selector: 'app-best-records-box',
  templateUrl: './best-records-box.component.html',
  styleUrls: ['./best-records-box.component.scss']
})
export class BestRecordsBoxComponent implements OnInit {

   //#region Public Members
   public teams: TeamModel[] = [];
   //#endregion
 
   //#region Constructor & Lyfecycle Hooks
   constructor() { }
 
   public ngOnInit(): void {
   }
   //#endregion
 
   //#region Public Methods
   //#endregion
}
