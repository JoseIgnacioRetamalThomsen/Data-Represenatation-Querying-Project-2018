import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from "@angular/forms";
import { User } from './../classes/User';
import { SignService } from '../services/sign.service'
import { Router } from "@angular/router";
import { SessionService } from './../services/session.service'
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  // emailIn;
  //nameIn;

  //password 

  hide = true;

  //isUnchanged = true;

  //form controls/validator
  //Create and add validotes to password Form Control : required,email
  email = new FormControl('', [Validators.required, Validators.email]);
  //values for max/min password length
  minPasswordLength = 1;
  maxPasswordLength = 16;
  //Create and add validotes to password Form Control : required,minLength, maxLength
  password = new FormControl('', [Validators.required, Validators.minLength(this.minPasswordLength), Validators.maxLength(this.maxPasswordLength)]);
  //values for max min name lengt
  minNameLength = 1;
  maxNameLength = 32
  //Create and add validotes to password Form Control : required,minLength, maxLength
  name = new FormControl('', [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);


  wrongDataMessage = false;
  emailInUseMessage = false;

  constructor(
    private signService: SignService,
    private router: Router,
    private session: SessionService
  ) { }

  ngOnInit() {

  }

  /*
  * Sign in/ sign out methods, calls from form
  */

  /*
  * Sign in
  */
  onSignIn():void {

    console.log("s:" + this.email.value.toUpperCase());
    console.log("s:" + this.password.value);
    //temporal for hold data
    var response;

    //check if email/password valid
    if (this.email.valid && this.password.valid) {

      this.signService.login(this.email.value.toUpperCase(), this.password.value).subscribe(data => {
        response = data;
        console.log("res7" + response.res);

        if (response.res) {
          //login successfull

          //log in in session (local storate)
          this.session.logIn(response.name, this.email.value, response.id);

          //navigate to home page
          this.router.navigate(['home']);

          //reload 
          window.location.reload();

        } else {//wrong data

          //show wrong data message
          this.wrongDataMessage = true;

        }//(response.res)

      });//this.signService.login(

    }//if(this.email.valid)

  }//onSignIn()

  /*
  * Sign out
  */
  onSignUp():void {

    var temp;


    if (this.email.valid && this.password.valid && this.name.valid) {

      //create user, email to upper case
      this.signService.addUser(this.email.value.toUpperCase(), this.password.value, this.name.value).subscribe(data => {
        //get data into temp
        temp = data;

        //check if create
        if (temp.created) {
          //was created

          //session login
          this.session.logIn(this.name.value, this.email.value.toUpperCase(), temp.id);

          //navigate to home page
          this.router.navigate(['home']);

          //reload windows
          window.location.reload();

        } else {
          //not created mean email in use

          //show email in use message
          this.emailInUseMessage = true;

        }// if (temp.created)

      });//this.signService.addUser(

    }//if (this.email.valid && this.password.valid && this.name.valid) 

  }//onSignUp()

  /*
  *form control methods
  */
  getErrorMessageEmail() {
    return this.email.hasError('required') ? 'You must enter a value' :

      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  getErrorMessagePassword() {

    return this.password.hasError('required') ? 'You must enter a value' :

      this.password.hasError('minlength') ? 'Min ' + this.minPasswordLength + ' characters long' :

        this.password.hasError('maxlength') ? 'Max ' + this.maxPasswordLength + ' characters long' :

          '';

  }

  getErrorMessageName() {
    return this.name.hasError('required') ? 'You must enter a value' :

      this.name.hasError('minlength') ? 'Min ' + this.minNameLength + ' characters long' :

        this.name.hasError('maxlength') ? 'Max ' + this.maxNameLength + ' characters long' :

          '';
  }

}//SignComponent
