import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { User } from '../classes/User';
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { SessionService } from './../services/session.service'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

/*
* Static top bar
*/
export class TopBarComponent implements OnInit {

  isLoggedIn = true;
  userName = "Jose Retamal";

  user: User = { name: "pepe", email: "my@gmail.com" };


  //serach 
  //values for max min name lengt
  minSearchLength = 1;
  maxSearchLength = 32
  //Create and add validotes to password Form Control : required,minLength, maxLength
  commentControl = new FormControl('', [Validators.required, Validators.minLength(this.minSearchLength), Validators.maxLength(this.maxSearchLength)]);
  searchText;
  constructor(iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private router: Router,
  ) {

    //icon
    iconRegistry.addSvgIcon(
      'search-icon',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/icon/search.svg'));

    this.isLoggedIn = session.isLogin();
    if (this.isLoggedIn) {
      this.user.name = session.getName();
    }

  }

  
  search() {

    this.router.navigate(['result/' + this.searchText]);
  }

  ngOnInit() {

  }
  //logout
  logOut() {

    this.session.logOut();
    window.location.reload();
  }

}
