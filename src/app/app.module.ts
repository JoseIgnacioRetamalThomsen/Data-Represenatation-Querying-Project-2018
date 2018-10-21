import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TopBarComponent } from './top-bar/top-bar.component';
import {CityPlacesComponent} from "./city-places/city-places.component"

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";

import { MyMaterial } from "./material/material.module";
//actu

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CityPlacesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MyMaterial,
    
  ],
  //  exports: [
  // MatToolbarModule,
  // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
