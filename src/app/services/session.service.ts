import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {

    console.log("Seecion constructor , login " + localStorage.getItem('isLogin'));
    if (localStorage.getItem('isLogin') == null) {
      localStorage.setItem('isLogin', "false");
    }
  }

  logIn(name: string, email: string, id: string, token: string) {
    localStorage.setItem('isLogin', "true");
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('id', id);
    localStorage.setItem('jwtToken', token);
    console.log("logger in : " + name + " " + email);


  }

  logOut() {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('jwtToken');
  }

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
