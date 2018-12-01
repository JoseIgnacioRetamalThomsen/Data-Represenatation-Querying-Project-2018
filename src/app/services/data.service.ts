import { Injectable } from '@angular/core';
import { PlacesService } from './../services/places.service';
import { Place } from './../classes/Place';
import { from } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/*
* Use for stores places, and no reload all time page is navigate
*/
export class DataService {


  places;

  constructor(
    private placesService: PlacesService,
  ) {
    //this.loadPlaces();
  }
  //return palces array
  getPlaces() {

    return this.places;
  }

  //set places for save
  setPlaces(places) {
    this.places = places;
  }

}
