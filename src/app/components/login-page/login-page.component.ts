import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  //#region Public Members
  public emailError: boolean;
  public passwordError: boolean;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  //#endregion
}
