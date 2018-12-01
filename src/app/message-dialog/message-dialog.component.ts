import { Component, OnInit } from '@angular/core';
import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {PopUpMessageData} from './../classes/PopUpMessageData';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})

/*
* Pop Up message
*/ 

export class MessageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpMessageData
  ) { }

  ngOnInit() {
  }

  //close when click anywere
  onNoClick(): void {

    this.dialogRef.close();
  }

}//MessageDialogComponent

