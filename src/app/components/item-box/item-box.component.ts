import { PageEnum } from '../../enums/componentview';
import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-item-box',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.scss']
})
export class ItemBoxComponent implements OnInit, AfterViewInit{
  
  //#region Region Public Members
  @Input() color: string;
  @Input() path: string;
  @Input() main: string;
  @Input() sub: string;
  @Output() CreateNewTrainningEvent: EventEmitter<PageEnum> = new EventEmitter();
  //#endregion
  
  //#region Constructor & Lifecycle Hooks
  constructor() { }
  
  public ngOnInit(): void {    
  }
  
  public ngAfterViewInit(): void {
    $("#div1"+this.color).css('background', this.color);
  }
  //#endregion
  
  //#region Public Methods
  /**
   * Event click handler
   */
  public Click():void{
    if(this.main == "  הקמת אימון חדש"){
      this.CreateNewTrainningEvent.emit(PageEnum.CreateTraining);
    }else if(this.main == "יצירת קבוצה "){
      this.CreateNewTrainningEvent.emit(PageEnum.CreateSwimmer);
    }else if(this.main == "     עריכת אימון"){
      this.CreateNewTrainningEvent.emit(PageEnum.EditTrainning);    
    }else{
      this.CreateNewTrainningEvent.emit(PageEnum.EditTeam);
    }
  }
  //#endregion
}
