import { Component, OnInit } from '@angular/core';
import { SignService } from './../services/sign.service';
import { SessionService } from './../services/session.service'
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MessageDialogComponent} from './../message-dialog/message-dialog.component';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {

  disabled = false;
  hide = true;

  constructor(
    private signService: SignService,
    private sessionService: SessionService,
    private router: Router,
    public dialog: MatDialog
  ) { }
  email = new FormControl('', [Validators.required, Validators.email]);
  user;

  test = "sdd";
  ngOnInit() {
    //get email
    const email = this.sessionService.getEmail();
    //get user data using the email
    this.signService.getUserByEmail(email).subscribe((data) => {

      this.user = data;
      this.email.setValue(this.user.email);

    });
  }

  openDialog(message:string,reload:boolean): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {message:message,reload:reload}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if(reload){
        window.location.reload();
      }
      
    });
  }


  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }


  onChangeDetails(detailsForm){
    console.log(detailsForm.value.name  );

    console.log(this.sessionService.getEmail());
    //check if changes
    if(this.email.value != this.sessionService.getEmail() || detailsForm.value.name != this.sessionService.getName()){
      console.log("dif");
      //update values in database 
      this.signService.updateUserDetails(this.user._id,detailsForm.value.name,this.email.value ).subscribe(()=>{
        
        //update session data
        this.sessionService.logIn(detailsForm.value.name,this.email.value,this.user._id,);
       
        //pop message to user
        this.openDialog("Account updated!",true);

        //reload windows for reload data
        
        
      });
    }

  }//onChangeDetails

  onChangePassword(form: NgForm) {

    //use sign service for check passowrd
    var response;
    this.signService.login(this.user.email, form.value.oldPass).subscribe((data) => {
      response = data;
      //check response
      if (response.res) {

        //ready for change pasword
        console.log("Ready to change password." + form.value.newPass);

        this.signService.updatePasswordById(this.sessionService.getId(), form.value.newPass).subscribe(() => {

          //update sucesfull reset form
          form.resetForm();
          //this.ngOnInit();

          //prompt user
          this.openDialog("Password changed!",false);

        });

      }//if(response.res){

    });//this.signService.login(


  }//onChangePassword

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


}//MyDetailsComponent
