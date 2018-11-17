import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Comment} from './../classes/Comment';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrls: ['./edit-comment-dialog.component.css']
})
export class EditCommentDialogComponent implements OnInit {
   

  comment;

  constructor(
    public dialogRef: MatDialogRef<EditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comment
  ) {
    this.comment = this.data.comment;
  }

  ngOnInit() {
    console.log("init");
    console.log(this.data.commentId);
    
  }

  saveChanges(){
    console.log(this.comment);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
