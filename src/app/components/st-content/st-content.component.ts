import { PageEnum } from '../../enums/componentview';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { RoleEnum } from '../../enums/roleenum';

@Component({
  selector: 'app-st-content',
  templateUrl: './st-content.component.html',
  styleUrls: ['./st-content.component.scss']
})
export class StContentComponent implements OnInit, OnChanges {

  //#region Public Members
  public pageenum: PageEnum = PageEnum.Landing;
  public state = PageEnum;
  public role = RoleEnum;
  @Input() stateFromFather: boolean;
  @Input() eventFromSideNav: PageEnum;
  @Input() stateChange: PageEnum;
  
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public profileservice: ProfileServiceService) { }

  public ngOnInit():void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(this.stateFromFather ){
      this.pageenum = PageEnum.Landing
    }
    if(this.eventFromSideNav){
      this.pageenum = this.eventFromSideNav;
    }
    if(this.stateChange !== undefined){
      this.pageenum = this.stateChange;
    }
  } 

  //#endregion
  /**
   * Goes to main page
   * @param event 
   */
  public LandToMainPage(event: PageEnum):void{
    if(event == PageEnum.Landing){
      this.pageenum = PageEnum.Landing;
    }
  }

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
