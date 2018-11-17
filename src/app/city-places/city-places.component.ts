import { Component, OnInit } from '@angular/core';
import { Place } from './../classes/Place';
import { PlacesService } from './../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommentsService } from './../services/comments.service';
import { SessionService } from './../services/session.service';
import { NgForm } from "@angular/forms";
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditCommentDialogComponent } from './../edit-comment-dialog/edit-comment-dialog.component';

import { Comment } from './../classes/Comment';


@Component({
  selector: 'app-city-places',
  templateUrl: './city-places.component.html',
  styleUrls: ['./city-places.component.css'],

})
export class CityPlacesComponent implements OnInit {

  place;//={id:"w",name:"Eire Square",description:"Galway square",photoAddress:"https://material.angular.io/assets/img/examples/shiba2.jpg"};  

  places;
  allCommentsPlace;
  placeNum = 0;

  isLogin = false;
  userId;

  commenterId;
  commenterName;
  commentText;

  constructor(
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private router: Router,
    private commentsService: CommentsService,
    private sessionService: SessionService,
    public dialog: MatDialog

  ) {
    // force route reload whenever params change (stack overflow)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.isLogin = sessionService.isLogin();
    this.userId = sessionService.getId();
    console.log("sw");
    console.log(this.isLogin == false);



    //console.log("id geted " +num);





  }//constructor
  re;

  edit(commentId:string,comment:string){
    const commentT = { commentId: commentId}
    this.openDialog(commentId,comment);
  }

  openDialog(commentId,comment:string): void {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '250px',
      data: {commentId: commentId , comment:comment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.re = result;
    });
  }


  getComments() {
    this.commentsService.getCommentsPlace(this.place._id).subscribe((data) => {
      console.log("geting data");


      this.allCommentsPlace = data;
      console.log(this.allCommentsPlace);
    });
  }

  ngOnInit() {
    const num = this.route.snapshot.paramMap.get('num');
    this.placesService.getPlaces().subscribe(((data) => {
      this.places = data;
      console.log(this.places);
      console.log(data);
      this.place = this.places[num];
      this.getComments();
    }));
    
  }

  comment;

  onAddPost(form: NgForm) {
    const num = this.route.snapshot.paramMap.get('num');
    console.log("working " + this.comment);
    console.log(this.place._id);

    this.commentsService.addComment(this.sessionService.getName(), this.sessionService.getId(), this.place._id, this.comment).subscribe(() => {

      console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
      form.reset();
      this.ngOnInit();

    });

  }//onAddPost(form:NgForm){

  onDelete(id: string) {

    this.commentsService.deletecommentId(id).subscribe((data) => {
      //id delete reset
      console.log(data);
      if (data.n == 1) {
        this.ngOnInit();
      }
    });
    console.log(id);
  }//onDelete(id:string){
}

