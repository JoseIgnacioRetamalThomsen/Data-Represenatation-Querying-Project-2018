import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SignService } from '../services/sign.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  
  id1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: SignService) {

    // force route reload whenever params change (stack overflow)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("w" + id);
    this.id1 = "" + id;
  }
  ngOnChanges() {
    console.log(this.route.snapshot.paramMap.get('id'));
  }
}
