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
  public eventPassFromSideNave: PageEnum;
  public title: string;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public httpservice: HttpService,
              public spinerservice: NgxUiLoaderService) { }

  public ngOnInit(): void {
    this.title = "תפריט ראשי";
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

  /**
   * Handle click event from side nav
   */
  public ClickFromSideNav(event: PageEnum){
    this.eventPassFromSideNave = event;
    switch(event){
      case PageEnum.Landing:
      this.title = "תפריט ראשי";
      break;
      case PageEnum.MyTrainnings:
      this.title = "האימונים שלי";
      break;
      case PageEnum.MyTeams:
      this.title = "הקבוצות שלי";
      break;
      case PageEnum.MySwimmers:
      this.title = "השחיינים שלי";
      break;
      case PageEnum.RealTimeTrainning:
      this.title = "אימון זמן אמת";
      break;
      case PageEnum.Statistics:
      this.title = "סטטיסטיקה";
      break;
      case PageEnum.MyMatalots:
      this.title = "מטלות";
      break;
      case PageEnum.Messages:
      this.title = "הודעות";
      break;
      case PageEnum.Settings:  
      this.title = "הגדרות";
      break;
      case PageEnum.Help:
      this.title = "עזרה";
      break;
    }
  }
  //#endregion

}
