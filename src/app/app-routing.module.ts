import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CityPlacesComponent} from './city-places/city-places.component';
import {HomeComponent} from './home/home.component';
import {SignComponent} from './sign/sign.component';
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'places', component: CityPlacesComponent },
  { path: "sign" , component : SignComponent},
  { path: 'detail/:id', component: UserDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
