import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Comment} from './../classes/Comment';
import {CommentsService} from './../services/comments.service';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.css']
})
export class EditCommentDialogComponent implements OnInit {
   

  comment;

  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comment,
    private commentsService:CommentsService
  ) {
    this.comment = this.data.comment;
  }

  ngOnInit() {
    console.log("init");
    console.log(this.data.commentId);
    
  }

  saveChanges(){
    console.log(this.comment);
    this.commentsService.editComment(this.data.commentId,this.comment).subscribe(()=>{
      
      //close dialog wiht true response
      this.dialogRef.close("true");
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  afterClosed():void{
    console.log("was close");
  }
}
