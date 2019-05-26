import * as $ from 'jquery';
import { NgxPrintModule} from 'ngx-print';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { TimerPipe } from './pipes/timerpipe';
import { AppComponent } from './app.component';
import { CustomDatePipe } from './pipes/datepipe';
import { MatDialogModule} from "@angular/material";
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MatSelectModule} from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { MatExpansionModule} from '@angular/material/expansion';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HelpComponent } from './components/help/help.component';
import { StatsComponent } from './components/stats/stats.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { HttpService } from './services/http-service/http-service.service';
import { ItemBoxComponent } from './components/item-box/item-box.component';
import { MyTeamsComponent } from './components/my-teams/my-teams.component';
import { MatalotsComponent } from './components/matalots/matalots.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { StHeaderComponent } from './components/st-header/st-header.component';
import { MyInterceptor } from './services/interceptor/http-interceptor.service';
import { StSidenavComponent } from './components/st-sidenav/st-sidenav.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MonthComponent } from './components/my-trainnings/month/month.component';
import { StContentComponent } from './components/st-content/st-content.component';
import { MySwimmersComponent } from './components/my-swimmers/my-swimmers.component';
import { TodoBoxComponent } from './components/item-box/todo-box/todo-box.component';
import { TvModeComponent } from './components/dialog-boxes/tv-mode/tv-mode.component';
import { ProfileServiceService } from './services/profile-service/profile-service.service';
import { MyTrainningsComponent } from './components/my-trainnings/my-trainnings.component';
import { SwimmerBoxComponent } from './components/item-box/swimmer-box/swimmer-box.component';
import { CreateTeamComponent } from './components/st-content/create-team/create-team.component';
import { ScheduleBoxComponent } from './components/item-box/schedule-box/schedule-box.component';
import { CreateTeamBoxComponent } from './components/dialog-boxes/create-team/create-team.component';
import { SwimmerMainPageComponent } from './components/swimmer-main-page/swimmer-main-page.component';
import { DetailsBoxComponent } from './components/swimmer-main-page/details-box/details-box.component';
import { PictureUpdateComponent } from './components/dialog-boxes/picture-update/picture-update.component';
import { TargetDetailsComponent } from './components/dialog-boxes/target-details/target-details.component';
import { RecordDetailsComponent } from './components/dialog-boxes/record-details/record-details.component';
import { CreateTrainingComponent } from './components/st-content/create-training/create-training.component';
import { RealTimeTrainningComponent } from './components/real-time-trainning/real-time-trainning.component';
import { AddTeamTargetComponent } from './components/dialog-boxes/add-team-target/add-team-target.component';
import { LastTrainingBoxComponent } from './components/item-box/last-training-box/last-training-box.component';
import { CreateTrainningComponent } from './components/dialog-boxes/create-trainning/create-trainning.component';
import { BestRecordsBoxComponent } from './components/swimmer-main-page/best-records-box/best-records-box.component';
import { GenericDialogBoxComponent } from './components/dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { AddSwimmerTargetComponent } from './components/dialog-boxes/add-swimmer-target/add-swimmer-target.component';
import { TeamTargetDetailsComponent } from './components/dialog-boxes/team-target-details/team-target-details.component';
import { AddTeamToTrainningComponent } from './components/dialog-boxes/add-team-to-trainning/add-team-to-trainning.component';
import { NotificationComponent } from './components/notification/notification.component';

const appRoutes: Routes = [
  { path: '' , component: LoginPageComponent},
  { path: 'mainmenu', component: MainPageComponent },
];
const config: SocketIoConfig = { url: 'https://record-system-server-1.herokuapp.com', options: {} };

@NgModule({
  declarations: [
    TimerPipe,
    AppComponent,
    HelpComponent,
    CustomDatePipe,
    MonthComponent,
    StatsComponent,
    TvModeComponent,
    ItemBoxComponent,
    MyTeamsComponent,
    TodoBoxComponent,
    MainPageComponent,
    StHeaderComponent,
    MatalotsComponent,
    MessagesComponent,
    SettingsComponent,
    LoginPageComponent,
    StSidenavComponent,
    StContentComponent,
    MySwimmersComponent,
    CreateTeamComponent,
    SwimmerBoxComponent,
    DetailsBoxComponent,
    ScheduleBoxComponent,
    MyTrainningsComponent,
    CreateTeamBoxComponent,
    PictureUpdateComponent,
    TargetDetailsComponent,
    AddTeamTargetComponent,
    RecordDetailsComponent,
    BestRecordsBoxComponent,
    CreateTrainingComponent,
    CreateTrainningComponent,
    SwimmerMainPageComponent,
    LastTrainingBoxComponent,
    GenericDialogBoxComponent,
    AddSwimmerTargetComponent,
    TeamTargetDetailsComponent,
    RealTimeTrainningComponent,
    AddTeamToTrainningComponent,
    NotificationComponent,
  ],
  imports: [
    FormsModule,
    ChartsModule,
    BrowserModule,
    DragDropModule,
    NgxPrintModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    },
    ProfileServiceService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TvModeComponent,
    CreateTeamBoxComponent,
    PictureUpdateComponent,
    TargetDetailsComponent,
    AddTeamTargetComponent,
    RecordDetailsComponent,
    CreateTrainningComponent,
    GenericDialogBoxComponent,
    AddSwimmerTargetComponent,
    TeamTargetDetailsComponent,
    AddTeamToTrainningComponent,
  ]
})
export class AppModule { }
