import { Component, OnInit, Input, AfterViewChecked, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { debug } from 'util';


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
  @Output() CreateNewTrainningEvent: EventEmitter<boolean> = new EventEmitter();
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
      this.CreateNewTrainningEvent.emit(true);
    }
  }
  //#endregion
}
