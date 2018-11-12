import { Component, OnInit } from '@angular/core';
import {SignService} from './../services/sign.service';
import {SessionService} from './../services/session.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {

  disabled = false;

  constructor(
    private signService : SignService,
    private sessionService:SessionService,
    private router: Router,
  ) { }
  email = new FormControl('', [Validators.required, Validators.email]);
    user;
    
    test = "sdd";
  ngOnInit() {
    const email =  this.sessionService.getEmail();
    this.signService.getUserByEmail(email).subscribe((data)=>{
      this.user=data;
      this.email.setValue(this.user.email);
      console.log(this.user.name);
    });
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
 
  onDelete(){
    console.log("delete");

    this.signService.deleteUserById(this.user._id).subscribe((data)=>{

      if(data.n==1){

        console.log("deleted");

        this.sessionService.logOut();

        this.router.navigate(['home']);

        window.location.reload();

      }
    });
  }

}
