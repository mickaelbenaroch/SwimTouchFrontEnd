import * as $ from 'jquery';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {MatDialogModule} from "@angular/material";
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { HttpService } from './services/http-service.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { ItemBoxComponent } from './components/item-box/item-box.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { StHeaderComponent } from './components/st-header/st-header.component';
import { StSidenavComponent } from './components/st-sidenav/st-sidenav.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { StContentComponent } from './components/st-content/st-content.component';
import { CreateTeamComponent } from './components/st-content/create-team/create-team.component';
import { CreateTeamBoxComponent } from './components/dialog-boxes/create-team/create-team.component';
import { PictureUpdateComponent } from './components/dialog-boxes/picture-update/picture-update.component';
import { CreateTrainingComponent } from './components/st-content/create-training/create-training.component';
import { CreateTrainningComponent } from './components/dialog-boxes/create-trainning/create-trainning.component';
import { GenericDialogBoxComponent } from './components/dialog-boxes/generic-dialog-box/generic-dialog-box.component';

const appRoutes: Routes = [
  {path: '' , component: LoginPageComponent},
  { path: 'mainmenu', component: MainPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ItemBoxComponent,
    MainPageComponent,
    StHeaderComponent,
    LoginPageComponent,
    StSidenavComponent,
    StContentComponent,
    CreateTeamComponent,
    CreateTeamBoxComponent,
    PictureUpdateComponent,
    CreateTrainingComponent,
    CreateTrainningComponent,
    GenericDialogBoxComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateTeamBoxComponent,
    PictureUpdateComponent,
    CreateTrainningComponent,
    GenericDialogBoxComponent,
  ]
})
export class AppModule { }
