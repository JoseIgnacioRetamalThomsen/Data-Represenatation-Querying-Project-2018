import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {SearchService} from './../services/search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService:SearchService
  ) { 
// force route reload whenever params change (stack overflow)
this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {

    const s = this.route.snapshot.paramMap.get('searchFor');

    console.log("on search");
    console.log(s);
    this.searchService.searchFor(s).subscribe((data)=>{
      

    });
  }

}
