import { Component, OnInit } from '@angular/core';
import {Place} from './../classes/Place'

@Component({
  selector: 'app-city-places',
  templateUrl: './city-places.component.html',
  styleUrls: ['./city-places.component.css']
})
export class CityPlacesComponent implements OnInit {

  place:Place ={name:"Eire Square",description:"Galway square"};  
  
  constructor() { }

  ngOnInit() {
  }

}
