import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NgForm } from "@angular/forms";
import {User} from './../../classes/User';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  panelOpenState = true;
  
  emailIn;
  password;
  hide = true;
  constructor() { }

  ngOnInit() {
    console.log();
  }


  

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }



  onSignIn(form: NgForm) {

    console.log("s:"+this.emailIn);
    console.log("s:"+this.password);
    
  }
  onSignUp(form: NgForm) {

    console.log("u:"+this.emailIn);
    console.log("u:"+this.password);
    
  }

}
