import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './../classes/Comment';
import { SessionService } from './session.service';


@Injectable({
  providedIn: 'root'
})

/*
* All methods to access commets data, 
*/
export class CommentsService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  /*
  * Call a method ins ever wich will create a new comment in database "commets", each coments is 
  * related to a place by placeId and to a user by comenterId(userId) and commentName(user name)
  */
  addComment(commenterName: string, commenterId: string, placeId: string,comment:string):Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };

    const commentToSend: Comment = { commenterName: commenterName, commenterId: commenterId, placeId: placeId,comment:comment };

    return this.http.post("http://localhost:8081/api/comment", commentToSend, httpOptions);

  }//addComment

  /*
  * Get all comets for one place using the placeId, id send as part of http request
  */
  getCommentsPlace(placeId:string):Observable<any> {

    return this.http.get("http://localhost:8081/api/comments/" + placeId);

  }//getCommentsPlace


  /*
  * delete a comment using id, id will be send as part of http request
  */

  deletecommentId(id: string): Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': this.sessionService.getToken() })
    };
    

    return this.http.delete("http://localhost:8081/api/comment/" + id, httpOptions);

  }//deletecommentId

  /*
  * Edit a comment (only the comment itself) the comment is identify by comment id which is send as part of 
  * http request, new commment is send as part of request body.
  */
  editComment(id:string,comment:string){

    const com = {comment:comment};

    return this.http.put("http://localhost:8081/api/updatecomment/"+id, com);

  }//editComment

}//CommentsService
