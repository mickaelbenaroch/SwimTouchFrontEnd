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
  public password: string;
  public email: string;
  //#endregion 
 
  //#region Constructor & Lifecycle Hooks
  constructor() { }

  public ngOnInit(): void {
    document.getElementById("envelop").style.height = window.innerHeight.toString() + 'px'
  }
  //#endregion

  //#region Public Methods
  /**
   * Validate email and password combinaison 
   */
  public Validate():void{debugger;
    if(!this.validateEmail(this.email)){
      this.emailError = true;
    }
  }

  //#endregion
  
  //#region private Methods
  /**
   * Email Validator
   */
  public validateEmail(email: string) :boolean{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Disable Error on email
   */
  public DisableError():void{
    if(this.emailError)
      this.emailError = false;
  }
  //#endregion
    
}
