import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  //#region Public Members
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  /**
   * Display hamburger menu on mobile only
   */
  public Menu():void{
    var temp  =document.getElementById("menu");
    temp.style.display = "block";
    temp.style.position = "absolute";
    temp.style.right = "0px";
    temp.style.top = "0px";
    temp.style.width = "unset";
    
  }
  //#endregion

}
