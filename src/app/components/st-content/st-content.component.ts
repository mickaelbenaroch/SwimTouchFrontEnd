import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-st-content',
  templateUrl: './st-content.component.html',
  styleUrls: ['./st-content.component.scss']
})
export class StContentComponent implements OnInit {

  //#region Public Members
  public add:boolean;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit():void {
  }
  //#endregion
  
  //#region Public Methods
  /**
   * Create New Event
   */
  public CreateNewTrainningEvent(event: boolean){
    if(event){
      this.add = event;
    }
  }
  //#endregion

}
