import { PageEnum } from '../../enums/componentview';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-st-content',
  templateUrl: './st-content.component.html',
  styleUrls: ['./st-content.component.scss']
})
export class StContentComponent implements OnInit, OnChanges {

  //#region Public Members
  public pageenum: PageEnum = PageEnum.Landing;
  public state = PageEnum;
  @Input() stateFromFather: boolean;
  
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit():void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(this.stateFromFather ){
      this.pageenum = PageEnum.Landing
    }
  } 

  //#endregion
  
  //#region Public Methods
  /**
   * Create New Event
   */
  public CreateNewTrainningEvent(event: PageEnum){
      switch(event){
        case PageEnum.Landing:
        this.pageenum = PageEnum.Landing;
        break;
        case PageEnum.CreateTraining:
        this.pageenum = PageEnum.CreateTraining;
        break;
        case PageEnum.CreateSwimmer:
        this.pageenum = PageEnum.CreateSwimmer;
        break;
        default:
        this.pageenum = PageEnum.Landing;
        break;
      }
  }
  //#endregion

}
