import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  /*
  * Get all places
  */
  getPlaces() {

    return this.http.get("http://localhost:8081/api/places");

  }//getPlaces()

  getPlacesTitles(){

    return this.http.get("http://localhost:8081/api/places/titles");
    
  }

}//export class PlacesService {
