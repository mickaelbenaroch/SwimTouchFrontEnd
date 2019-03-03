import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-st-sidenav',
  templateUrl: './st-sidenav.component.html',
  styleUrls: ['./st-sidenav.component.scss']
})
export class StSidenavComponent implements OnInit {

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
    var temp  = document.getElementById("menu");
    temp.style.display = "none";   
  }
  //#endregion

}
