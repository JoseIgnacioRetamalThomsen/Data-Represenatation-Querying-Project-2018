import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CityPlacesComponent} from './city-places/city-places.component';

const routes: Routes = [
  { path: 'places', component: CityPlacesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
