import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
//import { MatButtonModule,MatToolbarModule,MatIconModule,MatSidenavModule} from '@angular/material';
import { HttpClientModule } from "@angular/common/http";
import {MyMaterial} from "./material/material.module";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   // MatToolbarModule,
   // MatButtonModule,
   // MatIconModule,
    HttpClientModule,
   // MatSidenavModule
   MyMaterial
  ],
//  exports: [
   // MatToolbarModule,
 // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
