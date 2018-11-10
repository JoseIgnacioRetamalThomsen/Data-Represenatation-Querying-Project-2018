import { Component, OnInit } from '@angular/core';
import {SignService} from '../services/sign.service';

@Component({
  selector: 'app-users-side-list',
  templateUrl: './users-side-list.component.html',
  styleUrls: ['./users-side-list.component.css']
})
export class UsersSideListComponent implements OnInit {

  users;// = [{name:"Hd"},{name:"d"}];
  isLoad = false;
  constructor(private httpService : SignService) { }

  ngOnInit() {

    this.httpService.getUserBasic().subscribe((data) =>{
   
      this.users = data;
      console.log(this.users[0]._id);
    this.isLoad = true;

    });
  }

}
