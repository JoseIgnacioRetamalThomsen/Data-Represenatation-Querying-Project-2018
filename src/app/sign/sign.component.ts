import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SignService } from '../services/sign.service'
import { Router } from "@angular/router";
import { SessionService } from './../services/session.service'

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  hide = true;

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
  emailInUseMessage = true;
  signUpErrorMessage = ""

  constructor(
    private signService: SignService,
    private router: Router,
    private session: SessionService
  ) { }

  ngOnInit() { }

  /*
  * Sign up
  */
  onSignUp(): void {

    var temp;

    if (this.email.valid && this.password.valid && this.name.valid) {

      //create user, email to upper case
      this.signService.signUp(this.email.value.toUpperCase(), this.password.value, this.name.value).subscribe(data => {

        //get data into temp
        temp = data;

      }, (err) => {

        this.emailInUseMessage = true;
        //console.log(err);

      }, () => {
        //done
        //check if create
        if (temp.success) {

          console.log(temp.token)
          //session login
          this.session.logIn(this.name.value, this.email.value.toUpperCase(), temp.id, temp.token);

          //navigate to home page
          this.router.navigate(['home']);

          //reload windows
          window.location.reload();

        } else {

          this.signUpErrorMessage = temp.msg;
          this.emailInUseMessage = true;

        }

      });

    }

  }//onSignUp end

  /*
  * Sign in
  */
  onSignIn(): void {

    var response;

    //check if email/password valid
    if (this.email.valid && this.password.valid) {

      this.signService.signIn(this.email.value.toUpperCase(), this.password.value).subscribe(data => {

        response = data;

      }, (err) => {

        this.wrongDataMessage = true;
        //console.log(err);

      }, () => {

        if (response.success) {
          //login successfull

          //log in in session (local storate)
          this.session.logIn(response.name, this.email.value, response.id, response.token);

          //navigate to home page
          this.router.navigate(['home']);

          //reload 
          window.location.reload();

        } else {//wrong data

          //show wrong data message
          this.wrongDataMessage = true;

        }//(response.success)

      });//this.signService.login(

    }//if(this.email.valid)

  }//onSignIn()



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
