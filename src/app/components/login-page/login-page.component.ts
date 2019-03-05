import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginModel } from '../../models/LoginModel';
import { SignUpModel } from '../../models/SignUpModel';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HttpService } from '../../services/http-service.service';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';

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
  public signUp: boolean;
  public signupError: boolean;
  public LoginModel: LoginModel = new LoginModel();
  public SignUpModel: SignUpModel = new SignUpModel();
  //#endregion 
 
  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              public navservice: Router,
              private dialog: MatDialog,
              private ngxService: NgxUiLoaderService) { }

  public ngOnInit(): void {
  }
  //#endregion

  //#region Public Methods
  /**
   * Validate email and password combinaison 
   */
  public Validate():void{
    if(!this.validateEmail(this.email)){
      this.emailError = true;
    }else{
      this.ngxService.start();
      this.LoginModel.email = this.email;
      this.LoginModel.pass = this.password;
      this.httpservice.httpPost('login',this.LoginModel).subscribe((res) =>{
        this.ngxService.stop();
          if(res.isTrue == true){
            localStorage.setItem("email",this.LoginModel.email);
            this.navservice.navigateByUrl('/mainmenu');
          }
      },
      err =>{
        this.ngxService.stop();
        this.OpenDialog();
      })
    }
  }

  /**
   * Validate signup model
   */
  public ValidateSignUp():void{
    if(!this.validateEmail(this.SignUpModel.user) || this.SignUpModel.first_name == undefined || 
        this.SignUpModel.last_name == undefined || this.SignUpModel.group == undefined ||
        this.SignUpModel.pwd == undefined ){
      this.signupError = true;
    }
    this.ngxService.start();
    this.httpservice.httpPost('login/signup',this.SignUpModel).subscribe((res)=>{
      this.ngxService.stop();
      if(res.isTrue == true){
        localStorage.setItem("email",this.SignUpModel.user);
        this.navservice.navigateByUrl('/mainmenu');
      }
    },
    err =>{
      this.ngxService.stop();
      this.OpenDialog();
    })
  }

  /**
   * Loads signup gui
   */
  public SignUp():void{
    this.signUp = true;
  }

  /**
   * Error dialog Box Opening
   * @param email 
   */
  public OpenDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'נראה שמשהו השתבש בדרך...',
      body: 'הפרטים שהוזנו אינם נכונים, נסה שוב!',
      button: true,
      buttonText: "הבנתי!"
    };
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    this.dialog.open(GenericDialogBoxComponent, dialogConfig);
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

  /**
   * Mobile screen detector
   */
  public isMobileDevice():boolean {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };
  //#endregion
    
}
