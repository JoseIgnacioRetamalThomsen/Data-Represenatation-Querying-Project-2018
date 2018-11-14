import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './../classes/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient
  ) { }

  addComment(commenterName: string, commenterId: string, placeId: string,comment:string) {

    const commentToSend: Comment = { commenterName: commenterName, commenterId: commenterId, placeId: placeId,comment:comment };

    return this.http.post("http://localhost:8081/api/comment", commentToSend);

  }
}
