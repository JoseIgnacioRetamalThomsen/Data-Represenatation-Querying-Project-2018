import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { User } from '../classes/User';

import {SessionService} from './../services/session.service'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  isLoggedIn=true;
  userName = "Jose Retamal";
  
  user: User ={name:"pepe" ,email:"my@gmail.com"};

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,private session:SessionService) {

    //icon
    iconRegistry.addSvgIcon(
        'search-icon',
        sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/icon/search.svg'));
        
     this.isLoggedIn = session.isLogin();
     if(this.isLoggedIn) {
       this.user.name = session.getName();
     }

     console.log(this.isLoggedIn);

  }

  ngOnInit() {
  }

  logOut(){
    console.log("logout working");
    this.session.logOut();
    window.location.reload();
  }

}
