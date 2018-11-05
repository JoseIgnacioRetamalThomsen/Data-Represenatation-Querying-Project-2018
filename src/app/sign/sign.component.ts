import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NgForm } from "@angular/forms";
import {User} from './../classes/User';
import {SignService} from './../services/sign.service'

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  panelOpenState = true;
  
  emailIn;
  nameIn;
  password;
  hide = true;
  constructor(private signService:SignService) { }

  ngOnInit() {
    console.log();
  }


  

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }



  onSignIn() {

    console.log("s:"+this.emailIn);
    console.log("s:"+this.password);
    var response;
    this.signService.login(this.emailIn,this.password).subscribe(data=>{
      response =data;

      if(response.res){
        console.log("login");
      }else
      {
        console.log("not login");
      }
    });
    
  }

  onSignUp() {

    console.log("u:"+this.emailIn);
    console.log("u:"+this.password);
var r;
    this.signService.addUser(this.emailIn,this.password,this.nameIn).subscribe(data=>{
       //console.log(data);
      r=data;
      console.log("res"+r.created);
      
    });
    
  }

}
