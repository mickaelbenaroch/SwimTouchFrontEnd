import { Component, OnInit, Input, AfterViewChecked, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-item-box',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.scss']
})
export class ItemBoxComponent implements OnInit{
  
  //#region Region Public Members
  @Input() color: string;
  @Input() path: string;
  @Input() main: string;
  @Input() sub: string;
  //#endregion
  
  //#region Constructor & Lifecycle Hooks
  constructor() { }
  
  public ngOnInit(): void {
    var temp = document.getElementById("color");
    temp.style.background = this.color;
  }

  //#endregion
  
  //#region Public Methods
  //#endregion
}
