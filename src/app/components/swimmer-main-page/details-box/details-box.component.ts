import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../../models/TeamModel';

@Component({
  selector: 'app-details-box',
  templateUrl: './details-box.component.html',
  styleUrls: ['./details-box.component.scss']
})
export class DetailsBoxComponent implements OnInit {

  //#region Public Members
  public teams: TeamModel[] = [];
  //#endregion

  //#region Constructor & Lyfecycle Hooks
  constructor() { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  //#endregion

}
