import { Component, OnInit } from '@angular/core';
import { SignService } from '../services/sign.service';

@Component({
  selector: 'app-users-side-list',
  templateUrl: './users-side-list.component.html',
  styleUrls: ['./users-side-list.component.css']
})
export class UsersSideListComponent implements OnInit {

  //list of users with only basic data (name, id)
  users;
  errorMessage = ""

  constructor(private httpService: SignService) { }

  ngOnInit() {

    //get user names and id
    this.httpService.getUsersName().subscribe((data) => {

      this.users = data;

    }, (err) => {

      if (err.status == 0) {
        this.errorMessage = "Server not available please try again later";
      } else if (err.status == 500) {
        this.errorMessage = "Server error please try again later.";
      }

    });

  }//ngOnInit() 

  /*
  * Mouse event on each user for future develop 
  */
  onUserClick() {
    //console.log("working");
  }

  onMouseEnter() {
    //console.log("working");
  }

  onMouseLeave() {
    //console.log("working leave");
  }

}//UsersSideListComponent
