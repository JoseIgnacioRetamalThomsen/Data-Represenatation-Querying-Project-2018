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

  //the one place showing
  place;
  //list of all places
  places;

  //all coments list
  allCommentsPlace;
  //each place have a number wich is the position in the list, when fist navigate the first place n the list will be show.
  placeNum = 0;

  //used for decide what to show in ui
  isLogin = false;

  userId

  comment;

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

    //load user session data
    this.isLogin = sessionService.isLogin();
    this.userId = sessionService.getId();

  }//constructor

  ngOnInit() {

    //get route parameter
    const num = this.route.snapshot.paramMap.get('num');

    //get places 
    this.placesService.getPlaces().subscribe(((data) => {

      this.places = data;

      //set the place to show using the raoute parameter
      this.place = this.places[num];

      //load comments
      this.getComments();

    }));//this.placesService.getPlaces()

  }// ngOnInit()


  /*
  * Load all coments from commets services to allComentsPlace 
  */
  getComments() {

    this.commentsService.getCommentsPlace(this.place._id).subscribe((data) => {

      this.allCommentsPlace = data;

    });

  }//getComments()


  /*
  * Add new post to database "posts", using session data and the entered comment
  */
  onAddCooment(form: NgForm) {

    //suscribe to add comment in comments service
    this.commentsService.addComment(this.sessionService.getName(), this.sessionService.getId(), this.place._id, this.comment).subscribe(() => {

      //respose so commet was added

      //reset form
      form.reset();

      //reload page
      this.ngOnInit();
      //this.getComments();

    });

  }//onAddPost(form:NgForm){


  /*
  * Delete a post , user must be logged in for do it , comment is deleted using comment id
  */
  onDelete(id: string) {

    this.commentsService.deletecommentId(id).subscribe((data) => {

      //id delete reset
      if (data.n == 1) {

        //reload comments
        this.getComments();
      }

    });

  }//onDelete(id:string){

  /*
  *Edit comment : open pop up dialog wich return true if changes made in the comment, then
  *reload comments if changes.
  */
  editCommentDialog(commentId, comment: string): void {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '250px',

      //data send to dialog
      data: { commentId: commentId, comment: comment }
      
    });

    dialogRef.afterClosed().subscribe(result => {

      //check result for reload if change happens
      if (result) {

        //reload comments
        this.getComments();

      }

    });//dialogRef.afterClosed().subscribe(result

  }//editCommentDialog(

}//CityPlacesComponent

