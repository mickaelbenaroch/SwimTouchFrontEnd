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
import { ItemBoxComponent } from './components/item-box/item-box.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { StHeaderComponent } from './components/st-header/st-header.component';
import { StSidenavComponent } from './components/st-sidenav/st-sidenav.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { StContentComponent } from './components/st-content/st-content.component';
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
    MainPageComponent,
    LoginPageComponent,
    GenericDialogBoxComponent,
    StHeaderComponent,
    StSidenavComponent,
    StContentComponent,
    ItemBoxComponent,
    CreateTrainingComponent,
    CreateTrainningComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateTrainningComponent,
    GenericDialogBoxComponent,
  ]
})
export class AppModule { }
