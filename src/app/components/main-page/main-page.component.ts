import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { HttpService } from '../../services/http-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileModel } from '../../models/ProfileModel';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  //#region Public Members
  public profile: ProfileModel = new ProfileModel();
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
      "email": temp
    }
    this.spinerservice.start();
    this.httpservice.httpPost("profile", model).subscribe(
      (res: any)=>{
        this.spinerservice.stop();
        this.profile = res.data;
      },
      err =>{
        this.spinerservice.stop();
      }
    )
  }
  //#endregion

}
