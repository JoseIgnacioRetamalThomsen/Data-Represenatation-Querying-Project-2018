import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CityPlacesComponent} from './city-places/city-places.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'places', component: CityPlacesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
