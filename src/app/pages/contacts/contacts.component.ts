import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddItemDialog, EditItemDialog } from '../items/items.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  displayedColumns = ['name', 'description', 'phone', 'id'];
  dataSource: MatTableDataSource<Contact>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  items: any[];

  filterValue = "";

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    this.db.list('/contacts').snapshotChanges()
      .subscribe(actions => {
        this.items = [];
        actions.forEach(action => {
          this.items.push({$key: action.key, name: action.payload.val()['name'], description: action.payload.val()['description'], phone: action.payload.val()['phone']})
        });
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilter(this.filterValue);
      });
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(item) {
    this.db.list('/contacts').remove(item.$key);
  }

  change(item, changeCol) {
    this.openDialog(item, changeCol);
  }

  openDialog(item, changeCol) {
    if (changeCol == 1) {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: item.name, change: "Edit name", type: "text", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.db.list('/contacts').update(item.$key, { name: result.var });
        }
      });
    } else if (changeCol == 2) {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: item.name, change: "Edit description", type: "text", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.db.list('/contacts').update(item.$key, { description: result.var });
        }
      });
    } else {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: item.name, change: "Edit phone number", type: "number", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.db.list('/contacts').update(item.$key, { phone:  Number(result.var) });
        }
      });
    }
  }
}

export interface Contact {
  $key: string;
  name: string;
  description: string;
  phone: number;
}
