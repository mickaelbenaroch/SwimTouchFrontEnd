import { Component, OnInit } from '@angular/core';
import { SwimmerModel } from 'src/app/models/SwimmerModel';

@Component({
  selector: 'app-todo-box',
  templateUrl: './todo-box.component.html',
  styleUrls: ['./todo-box.component.scss']
})
export class TodoBoxComponent implements OnInit {

  //#region Public Members
  public swimmers: SwimmerModel[] = [];
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  //#endregion

}
