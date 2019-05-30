import { RoleEnum } from '../../enums/roleenum';
import { PageEnum } from 'src/app/enums/componentview';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProfileServiceService } from '../../services/profile-service/profile-service.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GenericDialogBoxComponent } from '../dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { PictureUpdateComponent } from '../dialog-boxes/picture-update/picture-update.component';

@Component({
  selector: 'app-st-sidenav',
  templateUrl: './st-sidenav.component.html',
  styleUrls: ['./st-sidenav.component.scss']
})
export class StSidenavComponent implements OnInit {

  //#region Public Members
  @Input() messages: number;
  @Output() eventFromSideNav: EventEmitter<PageEnum> = new EventEmitter();
  public role = RoleEnum;
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(public dialog: MatDialog,
              public profileservice: ProfileServiceService) { }

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

  /**
   * Handle click on sidenav item and redirect the user
   */
  public SideNiveClick(str: string):void{
    let innerWidth = window.innerWidth;
    var temp  = document.getElementById("menu");


    switch(str){
      case "landing":
      this.eventFromSideNav.emit(PageEnum.Landing);
      if(innerWidth < 600)
        temp.style.display = "none";   

      break;
      case "mytrainnings":
      this.eventFromSideNav.emit(PageEnum.MyTrainnings);
      if(innerWidth < 600)
        temp.style.display = "none";   
      break;
      case "myteams":
      this.eventFromSideNav.emit(PageEnum.MyTeams);
      if(innerWidth < 600)
        temp.style.display = "none";   
      break;
      case "myswimmers":
      this.eventFromSideNav.emit(PageEnum.MySwimmers);
      if(innerWidth < 600)
        temp.style.display = "none";   
      break;
      case "realtimetrainning":
      this.eventFromSideNav.emit(PageEnum.RealTimeTrainning);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
      case "statistics":
      this.eventFromSideNav.emit(PageEnum.Statistics);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
      case "matalots":
      this.eventFromSideNav.emit(PageEnum.MyMatalots);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
      case "messages":
      this.eventFromSideNav.emit(PageEnum.Messages);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
      case "settings":
      this.eventFromSideNav.emit(PageEnum.Settings);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
      case "help":
      this.eventFromSideNav.emit(PageEnum.Help);
      if(innerWidth < 600)
        temp.style.display = "none"; 

      break;
    }
  }

  /**
   * Update picture profile
   */
  public AddPictureProfile():void{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    dialogConfig.width = "420px";
    dialogConfig.height = "250px";
    var ref = this.dialog.open(PictureUpdateComponent, dialogConfig);
    ref.afterClosed().subscribe(
      res =>{ 
        console.log(res); 
        this.profileservice.GetProfile()
      }
    )
  }
  //#endregion

}
