import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TopBarComponent } from './top-bar/top-bar.component';
import {CityPlacesComponent} from "./city-places/city-places.component"

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { HttpClientModule } from "@angular/common/http";

import { MyMaterial } from "./material/material.module";
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';

import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule} from '@angular/forms';

//actu

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CityPlacesComponent,
    HomeComponent,
    SignComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
