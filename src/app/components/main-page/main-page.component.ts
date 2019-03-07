import { $ } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PageEnum } from '../../enums/componentview';
import { ProfileModel } from '../../models/ProfileModel';
import { HttpService } from '../../services/http-service.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  //#region Public Members
  public profile: ProfileModel = new ProfileModel();
  public homeEvent: boolean;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              public spinerservice: NgxUiLoaderService) { }

  public ngOnInit(): void {
    this.GetProfile();
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

  /**
   * Get profile of trainer
   */
  public GetProfile():void{
    var temp = localStorage.getItem("email");
    let model = {
      "user": temp
    }
    this.spinerservice.start();
    this.httpservice.httpPost("profile/getProfile", model).subscribe(
      (res: any)=>{
        this.spinerservice.stop();
        this.profile = res.data[0];
      },
      err =>{
        this.spinerservice.stop();
      }
    )
  }

  /**
   * Start times record
   */
  public Start():void{
    this.httpservice.httpGet("https://recordsystemserver.herokuapp.com").subscribe(
      res =>{
        console.log(res);
      },
      err =>{
        console.log(err);
      }
    )
  }

  /**
   * Go back yo main menu
   */
  public GoToMainMenu(event: PageEnum){
    this.homeEvent = !this.homeEvent;
  }
  //#endregion

}
