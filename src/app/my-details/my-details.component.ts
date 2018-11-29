import { Component, OnInit } from '@angular/core';
import { SignService } from './../services/sign.service';
import { SessionService } from './../services/session.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageDialogComponent } from './../message-dialog/message-dialog.component';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {

  disabled = false;
  hide = true;

  //form control

  email = new FormControl('', [Validators.required, Validators.email]);

  //values for max/min password length
  minPasswordLength = 1;
  maxPasswordLength = 16;
  //Create and add validotes to password Form Control : required,minLength, maxLength
  password = new FormControl('', [Validators.required, Validators.minLength(this.minPasswordLength), Validators.maxLength(this.maxPasswordLength)]);
  passwordNew = new FormControl('', [Validators.required, Validators.minLength(this.minPasswordLength), Validators.maxLength(this.maxPasswordLength)]);

  wrongPassword = false;

  //values for max min name lengt
  minNameLength = 1;
  maxNameLength = 32
  //Create and add validotes to password Form Control : required,minLength, maxLength
  name = new FormControl('', [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);;

  //keep user data
  user;

  constructor(
    private signService: SignService,
    private sessionService: SessionService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    //get email
    const email = this.sessionService.getEmail();

    //get user data using the email
    this.signService.getUserByEmail(email).subscribe((data) => {

      //set user from data
      this.user = data;

      //set email to email for controller
      this.email.setValue(this.user.email);

      //set user name to name for controller
      this.name.setValue(this.user.name);

    });//this.signService.getUserByEmail(email)

  }//ngOnInit()

  /*
  * Change details
  */
  onChangeDetails(detailsForm) {

    console.log(this.name.value);

    console.log(this.sessionService.getEmail());

    //check if valid and changes
    if (this.name.valid && this.email.valid && (this.email.value != this.sessionService.getEmail() || this.name.value != this.sessionService.getName())) {
      console.log("dif");
      //update values in database 
      this.signService.updateUserDetails(this.user._id, this.name.value, this.email.value).subscribe(() => {
        //response so update succesful

        //update session data
        this.sessionService.logIn(this.name.value, this.email.value, this.user._id, this.sessionService.getToken());

        //pop message to user
        this.openDialog("Account updated!", true);

        //reload windows for reload data

      });//this.signService.updateUserDetails(

    }//if(this.email.value !...

  }//onChangeDetails

  /*
  *  Change password
  */
  onChangePassword(form: NgForm) {

    //check if passwords are valid
    if (this.passwordNew.valid && this.password.valid) {

      var response;
      //check if password is right
      this.signService.signIn(this.user.email, this.password.value).subscribe((data) => {

        response = data;

      }, (err) => {

        //wrong password
        this.wrongPassword = true;

      }, () => {

        //check response
        if (response.success) {
           
          this.upDatePassword();

        } else {

          //wrong password show error message
          this.wrongPassword = true;

        }//if(response.res){

      });//this.signService.login(

    } else {

      //password not valid control form show message so nothing to do

    }

  }//onChangePassword

  private upDatePassword() {
    //ready for change pasword

    this.signService.updatePasswordById(this.sessionService.getId(), this.passwordNew.value).subscribe(() => {

    }, (err) => {

      this.wrongPassword = true;

    }, () => {

      //update sucesfull 
      //prompt user
      this.openDialog("Password changed!", false);

      //reset form manually
      this.password.setValue("");
      this.passwordNew.setValue("");
      this.wrongPassword = false;

    });// this.signService.updatePasswordById(t
  }

  /*
  * Delete Account
  */
  onDelete() {

    //user sign service to delete account using id    
    this.signService.deleteUserById(this.user._id).subscribe((data) => {

      if (data.n == 1) {

        //delet done so log out
        this.sessionService.logOut();

        //navigate to home page
        this.router.navigate(['home']);

        //reload app
        window.location.reload();

      }//if (data.n == 1)

    });//this.signService.deleteUserById(

  }//on delete

  /*
  * Form control methods
  */

  //email
  getErrorMessageEmail() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }//getErrorMessageEmail()

  //name
  getErrorMessageName() {
    return this.name.hasError('required') ? 'You must enter a value' :

      this.name.hasError('minlength') ? 'Min ' + this.minNameLength + ' characters long' :

        this.name.hasError('maxlength') ? 'Max ' + this.maxNameLength + ' characters long' :

          '';

  }

  //password
  getErrorMessagePassword(oldOrNew: string) {
    if (oldOrNew == "old") {
      return this.passwordNew.hasError('required') ? 'You must enter a value' :

        this.passwordNew.hasError('minlength') ? 'Min ' + this.minPasswordLength + ' characters long' :

          this.passwordNew.hasError('maxlength') ? 'Max ' + this.maxPasswordLength + ' characters long' :

            '';
    } else {
      return this.password.hasError('required') ? 'You must enter a value' :

        this.password.hasError('minlength') ? 'Min ' + this.minPasswordLength + ' characters long' :

          this.password.hasError('maxlength') ? 'Max ' + this.maxPasswordLength + ' characters long' :
            '';
    }//(oldOrNew == "old") 

  }//getErrorMessagePassword(oldOrNew: string)


  /*
  * Pop Up dialog methods
  */

  openDialog(message: string, reload: boolean): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: { message: message, reload: reload }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (reload) {
        window.location.reload();
      }

    });

  }//openDialog(message:string,reload:boolean)

}//MyDetailsComponent
