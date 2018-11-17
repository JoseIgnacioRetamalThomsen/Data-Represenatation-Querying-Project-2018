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

  getUserByEmail(email: string) {

    return this.http.get("http://localhost:8081/api/userEmail/" + email);

  }

  deleteUserById(id: string): Observable<any> {

    return this.http.delete("http://localhost:8081/api/user/" + id);

  }

  updateUserDetails(id:string,name:string,email:string){

    const user :User ={id:id,name:name,email:email};
    return this.http.put("http://localhost:8081/api/updateuser/"+id, user);

  }

  updatePasswordById(id:string,password:string){
    const req = {password:password};

    return this.http.put("http://localhost:8081/api/updatepassword/"+id, req);

  }
}
