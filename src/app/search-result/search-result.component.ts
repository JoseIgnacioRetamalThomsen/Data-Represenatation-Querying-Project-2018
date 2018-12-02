import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
/*
* Search not imlemented
*/
export class SearchResultComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // force route reload whenever params change (stack overflow)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {

  }

}
