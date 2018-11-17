import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TopBarComponent } from './top-bar/top-bar.component';
import {CityPlacesComponent} from "./city-places/city-places.component"
import {EditCommentDialogComponent} from './edit-comment-dialog/edit-comment-dialog.component'


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { HttpClientModule } from "@angular/common/http";

import { MyMaterial } from "./material/material.module";
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';

import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule} from '@angular/forms';
import { UsersSideListComponent } from './users-side-list/users-side-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';


//actu

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CityPlacesComponent,
    HomeComponent,
    SignComponent,
    UsersSideListComponent,
    UserDetailsComponent,
    MyDetailsComponent,
    EditCommentDialogComponent,
    MessageDialogComponent
  
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MyMaterial,
    ReactiveFormsModule,
   
  ],
  //  exports: [
  // MatToolbarModule,
  // ],
  entryComponents: [
    CityPlacesComponent,
    EditCommentDialogComponent,
    MessageDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
