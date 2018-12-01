import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';

@Injectable({
  providedIn: 'root'
})
/*
* Search not implemented
*/
export class SearchService {

  constructor(private http: HttpClient) { }

  searchFor(searchFor: string) {

    return this.http.get("http://localhost:8081/api/search/" + searchFor);

  }
}
