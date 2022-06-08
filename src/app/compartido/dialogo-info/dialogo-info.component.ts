import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-info',
  templateUrl: './dialogo-info.component.html',
  styleUrls: ['./dialogo-info.component.css']
})
export class DialogoInfoComponent implements OnInit {

  constructor(public dialogo: MatDialogRef<DialogoInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  ngOnInit(): void {
  }

}
