import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog } from '@angular/material';

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