import { Component, OnInit } from '@angular/core';
import {Place} from './../classes/Place';
import {PlacesService} from './../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {CommentsService} from './../services/comments.service';
import {SessionService} from './../services/session.service';


@Component({
  selector: 'app-city-places',
  templateUrl: './city-places.component.html',
  styleUrls: ['./city-places.component.css']
})
export class CityPlacesComponent implements OnInit {

  place:Place ;//={id:"w",name:"Eire Square",description:"Galway square",photoAddress:"https://material.angular.io/assets/img/examples/shiba2.jpg"};  

  places;
  placeNum =0;

  constructor(
    private placesService:PlacesService,
    private route: ActivatedRoute,
    private router: Router,
    private commentsService:CommentsService,
    private sessionService :SessionService
    
  ) {
// force route reload whenever params change (stack overflow)
this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    const num = this.route.snapshot.paramMap.get('num');

    console.log("id geted " +num);
    this.placesService.getPlaces().subscribe(((data)=> {
      this.places=data;
      console.log(this.places);
      console.log(data);
      this.place=this.places[num];

    }));
   }

  ngOnInit() {
   
  }

  onAddComment(){
    console.log("working");
    this.commentsService.addComment(this.sessionService.getName(),"id","other","no more today").subscribe();
  }
}
