import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  logIn(name:string,email:string){
    localStorage.setItem('isLogin', "true");
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);

    console.log("logger in : " + name + " " + email);


  }

  logOut(){
    localStorage.setItem('isLogin', "false");
    localStorage.setItem('name', "");
    localStorage.setItem('email', "");
  }

  isLogin():boolean{
    if(localStorage.getItem('isLogin')=="false")
      return false;
    return true;
  }
  getName():string{
    return localStorage.getItem('name')
  }
  getEmail():string{
    return localStorage.getItem('email')
  }
}
