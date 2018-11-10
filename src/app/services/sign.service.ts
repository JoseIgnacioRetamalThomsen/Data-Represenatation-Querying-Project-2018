import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';

@Injectable({
  providedIn: 'root'
})
export class SignService {



  constructor(private http: HttpClient) { }

  addUser(email: string, password: string, name: string) {

    const user: User = { email: email, password: password, name: name };

    return this.http.post("http://localhost:8081/api/user", user);

  }

  login(email: string, password: string) {

    const user: User = { email: email, password: password, name };

    return this.http.post("http://localhost:8081/api/login", user);
  }


  getUserBasic() {
    return this.http.get("http://localhost:8081/api/usernames");
  }

  getUserById(id: string) {

    return this.http.get("http://localhost:8081/api/user/" + id);
    
  }

}
