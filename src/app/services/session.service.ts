import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/*
* Store session data in local storage
*/
export class SessionService {

  constructor() {

    //create login if do not exist
    if (localStorage.getItem('isLogin') == null) {
      localStorage.setItem('isLogin', "false");
    }
  }

  //login, save all data in local storage 
  logIn(name: string, email: string, id: string, token: string) {

    localStorage.setItem('isLogin', "true");
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('id', id);
    localStorage.setItem('jwtToken', token);



  }

  //remove all data from local stora and set login to false
  logOut() {

    localStorage.setItem('isLogin', "false");
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('jwtToken');

  }

  /*
  * Getters for all data
  */
  isLogin(): boolean {
    if (localStorage.getItem('isLogin') == "false")
      return false;
    return true;
  }
  getName(): string {
    return localStorage.getItem('name');
  }
  getEmail(): string {
    return localStorage.getItem('email').toUpperCase();
  }
  getId(): string {
    return localStorage.getItem('id');
  }
  getToken(): string {
    return localStorage.getItem('jwtToken');
  }
  
}
