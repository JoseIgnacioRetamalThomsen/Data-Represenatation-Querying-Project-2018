import { Component, OnInit } from '@angular/core';
import { SignService } from './../services/sign.service';
import { SessionService } from './../services/session.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { MessageDialogComponent } from './../message-dialog/message-dialog.component';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})

/*
* Show details about a user
*/

export class MyDetailsComponent implements OnInit {

  //delete account check box
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
  onChangeDetails() {

    var tempData;

    //check if valid and changes
    if (this.name.valid && this.email.valid && (this.email.value != this.sessionService.getEmail() || this.name.value != this.sessionService.getName())) {

      //update values in database 
      this.signService.updateUserDetails(this.user._id, this.name.value, this.email.value).subscribe((data) => {

        tempData = data

      }, (error) => {

        if (error.status == 0) {

          this.openDialog("Connection problem , try again.", false);

        } else if (error.status == 400) {

          this.openDialog("wrong data, try again.", false);

        } else if (error.status == 500) {

          this.openDialog("Server error , try again.", false);

        } else if (error.status == 401 || error.status == 403 ) {

          //Unauthorized logout and reload
          this.sessionService.logOut();
          this.router.navigate(['home']);
          window.location.reload();

        }

      }, () => {

        if (tempData) {
          ///update sucess
          if (tempData.success) {

            //update session data
            this.sessionService.logIn(this.name.value, this.email.value, this.user._id, this.sessionService.getToken());

            this.openDialog("Account updated!", true);
          }
        }
      });//this.signService.updateUserDetails(

    }//if(this.email.value !...

  }//onChangeDetails

  /*
  *  Change password
  */
  onChangePassword() {

    //check if passwords are valid
    if (this.passwordNew.valid && this.password.valid) {

      var response;
      //check if password is right
      this.signService.signIn(this.user.email, this.password.value).subscribe((data) => {

        response = data;

      }, (err) => {
        if (err.status == 401) {

          //wrong password
          this.wrongPassword = true;
        } else if (err.status == 500) {

          this.openDialog("Server error , try again.", false);

        } else if (err.status == 0) {

          this.openDialog("Connection problem , try again.", false);

        }

      }, () => {

        //check response
        if (response.success) {

          //ready to change password
          //call private method wich update the password by subscribint to updatePasswordById()
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

    this.signService.updatePasswordById(this.sessionService.getId(), this.passwordNew.value).subscribe(() => {

    }, (err) => {
      if (err.status == 401) {

        //wrong password
        this.wrongPassword = true;
        
      } else if (err.status == 500) {

        this.openDialog("Server error , try again.", false);

      } else if (err.status == 0) {

        this.openDialog("Connection problem , try again.", false);

      }

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

    var dataTemp;
    //user sign service to delete account using id    
    this.signService.deleteUserById(this.user._id).subscribe((data) => {

      dataTemp = data;

    }, (error) => {

      if ( error.status ==401 || error.status == 403 ) {

        //invalid token just logout and reload
        this.sessionService.logOut();
        //navigate to home page
        this.router.navigate(['home']);

        //reload app
        window.location.reload();

      } else if (error.status == 0) {
        //pop message to user
        this.openDialog("Connection problem , try again.", false);


      }
    }, () => {

      //deleted
      if (dataTemp.n == 1) {

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


      if (reload) {
        window.location.reload();
      }

    });

  }//openDialog(message:string,reload:boolean)

}//MyDetailsComponent
