import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../classes/User';

@Injectable({
  providedIn: 'root'
})
export class SignService {

  constructor(private http: HttpClient) { }

  addUser(email: string, password: string) {

    const user: User = { email: email, password: password };

    return this.http.post("http://localhost:8081/api/user",user);

  }

  login(email: string, password: string) {

    const user: User = { email: email, password: password };

    return this.http.post("http://localhost:8081/api/login",user);
  }
}