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
import { MainPageComponent } from './components/main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { LoginPageComponent } from './components/login-page/login-page.component';
import { GenericDialogBoxComponent } from './components/dialog-boxes/generic-dialog-box/generic-dialog-box.component';
import { StHeaderComponent } from './components/st-header/st-header.component';
import { StSidenavComponent } from './components/st-sidenav/st-sidenav.component';
import { StContentComponent } from './components/st-content/st-content.component';
    
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
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes),
    FormsModule,
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent],
  entryComponents: [GenericDialogBoxComponent]
})
export class AppModule { }
