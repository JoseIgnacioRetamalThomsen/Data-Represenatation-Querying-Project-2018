import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SignService } from '../services/sign.service';

/*
* Shows all details for 1 user
*/

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  //user data
  user;
  found = true;

  //error
  errorMessage = "";



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signService: SignService
  ) {

    // force route reload whenever params change (stack overflow)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
    this.getUser();
  }

  //get user data
  getUser() {
    const id = this.route.snapshot.paramMap.get('id');

    this.signService.getUserById(id).subscribe((userData) => {

      this.user = userData;

    }, (err) => {


      if (err.status == 404) {

        this.found = false;
        this.errorMessage = "404 User Not Found."

      } else if (err.status == 500) {
        this.found = false;
        this.errorMessage = "Server problen try again later."

      } else if (err.status == 0) {
        this.found = false;
        this.errorMessage = "Connection problem, tru again later."
      }

    });
    
  }

}
