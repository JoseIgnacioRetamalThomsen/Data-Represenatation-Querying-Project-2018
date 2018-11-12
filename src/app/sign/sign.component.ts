import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from "@angular/forms";
import { User } from './../classes/User';
import { SignService } from '../services/sign.service'
import { Router } from "@angular/router";
import {SessionService} from './../services/session.service'

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  //[(ngModel)]="emailIn"

  panelOpenState = true;

  emailIn;
  nameIn;
  password;
  hide = true;

  isUnchanged = true;

  constructor(
    private signService: SignService, 
    private router: Router,
    private session : SessionService
    ) { }

  ngOnInit() {
    console.log();
  }




  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }



  onSignIn() {

    console.log("s:" + this.email.value);
    console.log("s:" + this.password);
    var response;
    this.signService.login(this.email.value, this.password).subscribe(data => {
      response = data;

      if (response.res) {

        this.session.logIn(response.name,this.email.value);

        this.router.navigate(['home']);
          window.location.reload();

      } else {
        console.log("not login");
      }
    });

  }

  onSignUp() {

    console.log("u:" + this.email.value);
    console.log("u:" + this.password);
    var r;
    if(this.password==null){console.log("ynull")}
    if (this.email.valid && this.password!=null &&this.nameIn!=null &&this.password!=""&&this.nameIn!="") {

      this.signService.addUser(this.email.value, this.password, this.nameIn).subscribe(data => {
        //console.log(data);
        r = data;
        console.log("res" + r.created);
        if (r.created) {
          console.log("u:" + this.password);
          this.router.navigate(['home']);
          window.location.reload();

          this.session.logIn(this.nameIn,this.email.value);

        } else {
          this.isUnchanged = false;
        }

      });
    }
  }

}
