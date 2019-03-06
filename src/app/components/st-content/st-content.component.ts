import { Component, OnInit } from '@angular/core';
import { PageEnum } from '../../enums/componentview';

@Component({
  selector: 'app-st-content',
  templateUrl: './st-content.component.html',
  styleUrls: ['./st-content.component.scss']
})
export class StContentComponent implements OnInit {

  //#region Public Members
  public pageenum: PageEnum = PageEnum.Landing;
  public state = PageEnum;
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
      this.pageenum = PageEnum.CreateTraining;
    }
  }
  //#endregion

}
