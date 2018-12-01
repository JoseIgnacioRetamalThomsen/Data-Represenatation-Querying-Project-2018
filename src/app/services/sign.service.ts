import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

/*
* Manage all user data
*/

export class SignService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  //create new user, email is store in upper case
  signUp(email: string, password: string, name: string): Observable<any> {

    const user: User = { email: email.toUpperCase(), password: password, name: name };

    return this.http.post("http://localhost:8081/api/signup", user);

  }

  //login 
  signIn(email: string, password: string): Observable<any> {

    const user: User = { email: email.toUpperCase(), password: password, name };

    return this.http.post("http://localhost:8081/api/signin", user);

  }

  //return all user name no need authentication
  getUsersName(): Observable<any> {

    return this.http.get("http://localhost:8081/api/usernames");

  }

  //return all user data but password no need authentication
  getUserById(id: string) : Observable<any>{

    return this.http.get("http://localhost:8081/api/user/" + id);

  }

  getUserByEmail(email: string): Observable<any> {

    return this.http.get("http://localhost:8081/api/userEmail/" + email.toUpperCase());

  }

  deleteUserById(id: string): Observable<any> {


    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };

    return this.http.delete("http://localhost:8081/api/user/" + id, httpOptions);

  }

  updateUserDetails(id: string, name: string, email: string): Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };

    const user: User = { id: id, name: name, email: email.toUpperCase() };

    return this.http.put("http://localhost:8081/api/updateuser/" + id, user, httpOptions);

  }

  updatePasswordById(id: string, password: string) : Observable<any>{

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };

    const req = { password: password };

    return this.http.put("http://localhost:8081/api/updatepassword/" + id, req, httpOptions);

  }
}
