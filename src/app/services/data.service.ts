import { Injectable } from '@angular/core';
import { PlacesService } from './../services/places.service';
import { Place } from './../classes/Place';
import { from } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {


  places;

  constructor(
    private placesService: PlacesService,
  ) { 
    this.loadPlaces();
  }

  loadPlaces() {

    this.placesService.getPlaces().subscribe(((data) => {

      this.places = data;



      console.log(this.places);
    }));//this.placesService.getPlaces()

  }

  getPlaces(){

    return this.places;
 }

 setPlaces(places){
   this.places =places;
 }

}
