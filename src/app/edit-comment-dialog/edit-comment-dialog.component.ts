import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Comment } from './../classes/Comment';
import { CommentsService } from './../services/comments.service';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.css']
})

/*
* Pop up message dialog for edit comments
*/
export class EditCommentDialogComponent implements OnInit {


  comment;

  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comment,
    private commentsService: CommentsService
  ) {
    this.comment = this.data.comment;
  }

  ngOnInit() {


  }
   /*
   * Save button pressed
   */
  saveChanges() {

    var tempData;

    this.commentsService.editComment(this.data.commentId, this.comment).subscribe((data) => {

      tempData = data;

    }, (error) => {
      if (error.status == 500) {

        const response = { updated: false, error: true, status: 500, msg: "Server error, try again later" }
        this.dialogRef.close(response);


      } else if (error.status == 401 || error.status == 403) {

        //unauthorized logout and reload

        const response = { updated: false, error: true, status: 401, msg: "Unauthorized" }
        this.dialogRef.close(response);

      } else if (error.status == 0) {

        const response = { updated: false, error: true, status: 0, msg: "Connection problems , try again later." }
        this.dialogRef.close(response);
      }
    }, () => {

      //close dialog and reload coments
      const response = { updated: true, error: false, msg: "Comment edit." }
      this.dialogRef.close(response);

    });

  }


  /*
  * When clock anywere. close dialog and not update , also cancel button
  */
  onNoClick(): void {

    //close dialog with false response; no changes made
    const response = { updated: false, error: false, msg: "No changes" }
    this.dialogRef.close(response);
  }


}
