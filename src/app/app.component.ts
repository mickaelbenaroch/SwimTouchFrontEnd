import { Component } from '@angular/core';
import { RoleEnum } from './enums/roleenum';
import { ProfileServiceService } from './services/profile-service/profile-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SwimTouch';
  public role = RoleEnum;

  constructor(public profileservice: ProfileServiceService){ }
}
