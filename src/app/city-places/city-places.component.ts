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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { EditCommentDialogComponent } from './../edit-comment-dialog/edit-comment-dialog.component';
import { FormControl, Validators } from '@angular/forms';

import { Comment } from './../classes/Comment';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-city-places',
  templateUrl: './city-places.component.html',
  styleUrls: ['./city-places.component.css'],

})
export class CityPlacesComponent implements OnInit {

  //the one place showing
  place = null;
  //list of all places
  places;

  //all coments list
  allCommentsPlace;
  //each place have a number wich is the position in the list, when fist navigate the first place n the list will be show.
  placeNum = 0;

  //used for decide what to show in ui
  isLogin = false;

  userId;

  isPlacesError = false;
  placesError = "";

  commentError = ""
  isCommentError = false;

  //values for max min name lengt
  mincommentLength = 1;
  maxcommentLength = 6000;
  //Create and add validotes to password Form Control : required,minLength, maxLength
  commentControl = new FormControl('', [Validators.required, Validators.minLength(this.mincommentLength), Validators.maxLength(this.maxcommentLength)]);



  constructor(

    private placesService: PlacesService,
    private route: ActivatedRoute,
    private router: Router,
    private commentsService: CommentsService,
    private sessionService: SessionService,
    public dialog: MatDialog,
    private dataService: DataService

  ) {
    // force route reload whenever params change (stack overflow)
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    //load user session data
    this.isLogin = sessionService.isLogin();
    this.userId = sessionService.getId();

    const ciTyNum = this.route.snapshot.paramMap.get('num');

    //get places
    this.places = this.dataService.getPlaces();

    //this is done for no call the server every time places page is requested or a new place is clicked.
    //if they are null mean they are not cached in data.service so we load it
    if (this.places == null) {

      //get services
      this.placesService.getPlaces().subscribe((data) => {

        this.places = data;

        //set the place to show using the raoute parameter
        this.place = this.places[ciTyNum];

        if (this.place == null) {

          this.isPlacesError = true;
          this.placesError = "place not found.";

        } else {

          //load comments
          this.getComments();

          //save places in data service
          this.dataService.setPlaces(this.places);
        }
      }, (error) => {

        if (error.status == 500) {

          this.isPlacesError = true;
          this.placesError = "Server error, please try again later."

        } else if (error.status == 0) {

          this.isPlacesError = true;
          this.placesError = "Conection problems/ server down try again later."
        }

      }, () => {

        //set the place to show using the router parameter
        this.place = this.places[ciTyNum];

        //check for brong parameter tha may be input manually
        if (this.place == null) {

          this.isPlacesError = true;
          this.placesError = "404 place not found.";

        }

        //load comments
        this.getComments();

      });//this.placesService.getPlaces()

    } else {//if not null means they are already in data.service

      //set place
      this.place = this.places[ciTyNum];

      //check for brong parameter tha may be input manually
      if (this.place == null) {

        this.isPlacesError = true;
        this.placesError = "place not found.";

      }
      //load comments
      this.getComments();

    }//if (this.places == null)

  } //constructor

  ngOnInit() {

    this.getComments();

  }// ngOnInit()


  /*
  * Load all coments from commets services to allComentsPlace 
  */
  getComments() {

    this.commentsService.getCommentsPlace(this.place._id).subscribe((data) => {

      this.allCommentsPlace = data;

    }, (error) => {
      if (error.status == 404) {

        this.isPlacesError = true;
        this.placesError = "404 place not found.";
      }
    }, () => {

    });

  }//getComments()


  /*
  * Add new post to database "posts", using session data and the entered comment
  */
  onAddCooment() {

    var tempData;

    if (this.commentControl.valid) {
      //suscribe to add comment in comments service
      this.commentsService.addComment(this.sessionService.getName(), this.sessionService.getId(), this.place._id, this.commentControl.value).subscribe((data) => {

        tempData = data;

      }, (error) => {

        if (error.status == 500) {

          this.isCommentError = true;
          this.commentError = "Server error, try again later"

        } else if (error.status == 403) {

          //unauthorized logout and reload
          this.sessionService.logOut();
          this.router.navigate(['home']);
          window.location.reload();

        } else if (error.status == 0) {

          this.isCommentError = true;
          this.commentError = "Connection probles , try again later."
        }
      }, () => {

        if (tempData.success) {

          this.isCommentError = false;

          this.commentControl.reset();
          this.ngOnInit();

        }
      });
    }
  }//onAddPost(form:NgForm){


  /*
  * Delete a post , user must be logged in for do it , comment is deleted using comment id
  */
  onDelete(id: string) {

    var tempData;

    this.commentsService.deletecommentId(id).subscribe((data) => {

      tempData = data;
      //id delete reset
      if (data.n == 1) {

        //reload comments
        this.getComments();
      }

    }, (error) => {
      if (error.status == 500) {

        this.isCommentError = true;
        this.commentError = "Server error, try again later"

      } else if (error.status == 403) {

        //unauthorized logout and reload
        this.sessionService.logOut();
        this.router.navigate(['home']);
        window.location.reload();

      } else if (error.status == 0) {

        this.isCommentError = true;
        this.commentError = "Connection problems , try again later."
      }

    }, () => {
      if (tempData.n == 1) {

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

  getErrorMessageComment() {
    return this.commentControl.hasError('required') ? 'You must enter a value' :

      this.commentControl.hasError('minlength') ? 'Min ' + this.mincommentLength + ' characters long' :

        this.commentControl.hasError('maxlength') ? 'Max ' + this.maxcommentLength + ' characters long' :

          '';
  }

}//CityPlacesComponent

