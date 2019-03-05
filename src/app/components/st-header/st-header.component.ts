import { Component, OnInit, Input } from '@angular/core';
import { ProfileModel } from '../../models/ProfileModel';

@Component({
  selector: 'app-st-header',
  templateUrl: './st-header.component.html',
  styleUrls: ['./st-header.component.scss']
})
export class StHeaderComponent implements OnInit {

  //#region Public Members 
  @Input() title: string;
  @Input() profile: ProfileModel;
  //#endregion

  //#region Constructor & Lifecycle Hooks 
  constructor() { }

  public  ngOnInit():void {
  }
  //#endregion

  //#region Public Methods 
  //#endregion

}
