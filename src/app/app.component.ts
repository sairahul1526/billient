import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddItemDialog, EditItemDialog } from './pages/items/items.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  index = 0;

  ngOnInit() {

  }

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    
  }

  buttonClicked() {
    if (this.index == 1) {
      this.addItem();
    } else if (this.index == 2) {
      this.addGoDown();
    } else if (this.index == 3) {
      this.addDebt();
    } else if (this.index == 4) {
      this.addContact();
    }
  }

  addDebt() {
    let dialogRef = this.dialog.open(EditItemDialog, {
      width: '250px',
      data: { name: "", change: "Add Customer", type: "text", var: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.var) {
        this.db.list('/debts').push({ name: result.var });
      }
    });    
  }

  addContact() {
    let dialogRef = this.dialog.open(AddContactDialog, {
      width: '250px',
      data: { name: "", description: "", phone: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.dir(result);
      if (result) {
        this.db.list('/contacts').push({name: result.name, description: result.description, phone: result.phone })
      }
    });   
  }

  addItem() {
    let dialogRef = this.dialog.open(AddItemDialog, {
      width: '250px',
      data: { name: "", quantity: "", price: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.dir(result);
      if (result) {
        this.db.list('/items').push({name: result.name, quantity: result.quantity, price: result.price })
      }
    });
  }

  addGoDown() {
    let dialogRef = this.dialog.open(EditItemDialog, {
      width: '250px',
      data: { name: "", change: "Add GoDown", type: "text", var: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.var) {
        this.db.list('/godowns').push({ name: result.var });
      }
    });
  }
  
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Add Business Contact</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput placeholder="name" [(ngModel)]="data.name">
    </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="description" [(ngModel)]="data.description">
    </mat-form-field>
    <mat-form-field>
      <input matInput type="number" placeholder="Phone Number" [(ngModel)]="data.phone" (keydown.enter)="save()">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button (click)="save()">Ok</button>
  </div>`,
})
export class AddContactDialog {

  constructor(
    public dialogRef: MatDialogRef<AddContactDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if (this.data.name != "" && this.data.description != "" && this.data.phone) {
      this.dialogRef.close(this.data);
    }
  }

}