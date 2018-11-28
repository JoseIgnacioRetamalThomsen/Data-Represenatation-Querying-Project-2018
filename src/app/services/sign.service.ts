import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class SignService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  //create new user, email is store in upper case
  signUp(email: string, password: string, name: string) {

    const user: User = { email: email.toUpperCase(), password: password, name: name };

    return this.http.post("http://localhost:8081/api/signup", user);

  }

  //login 
  signIn(email: string, password: string) {

    const user: User = { email: email.toUpperCase(), password: password, name };

    return this.http.post("http://localhost:8081/api/signin", user);

  }

  //return all user name no need authentication
  getUsersName() {

    return this.http.get("http://localhost:8081/api/usernames");

  }

  //return all user data but password no need authentication
  getUserById(id: string) {

    return this.http.get("http://localhost:8081/api/user/" + id);

  }

  getUserByEmail(email: string) {

    return this.http.get("http://localhost:8081/api/userEmail/" + email.toUpperCase());

  }

  deleteUserById(id: string): Observable<any> {

    console.log(this.sessionService.getToken());
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };

    return this.http.delete("http://localhost:8081/api/user1/" + id, httpOptions);

  }

  updateUserDetails(id: string, name: string, email: string) {

    const user: User = { id: id, name: name, email: email.toUpperCase() };
    return this.http.put("http://localhost:8081/api/updateuser/" + id, user);

  }

  updatePasswordById(id: string, password: string) {
    const req = { password: password };

    return this.http.put("http://localhost:8081/api/updatepassword/" + id, req);

  }
}
