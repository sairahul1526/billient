import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog } from '@angular/material';

import { EditItemDialog } from '../items/items.component';

@Component({
  selector: 'app-godown',
  templateUrl: './godown.component.html',
  styleUrls: ['./godown.component.css']
})
export class GodownComponent implements OnInit {

  displayedColumns = ['name', 'quantity', 'id'];
  dataSource: MatTableDataSource<Item>[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  goDowns: any[];

  step = 0;

  ngOnInit() {
  }

  setStep(index: number) {
    this.step = index;
  }

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    this.db.list('/godowns').snapshotChanges()
      .subscribe(actions => {
        this.goDowns = [];
        actions.forEach(action => {
          this.goDowns.push({$key: action.key, name: action.payload.val()['name'], items: action.payload.val()['items'] ? Object.values(action.payload.val()['items']) : []});
        });
      });
  }

  addItem(godown) {
    console.log(godown);
    let dialogRef = this.dialog.open(EditItemDialog, {
      width: '250px',
      data: { name: godown.name, change: "Add Item", type: "text", var: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.var) {
        let pushed = this.db.list('/godowns/' + godown.$key + '/items').push({ name: result.var, quantity: 0 });
        this.db.list('/godowns/' + godown.$key + '/items').update(pushed.key, { id: pushed.key });
      }
    });
  }

  add(key, id, quantity) {
    this.db.list('/godowns/' + key + '/items').update(id, { quantity: quantity + 1 });
  }

  minus(key, id, quantity) {
    if (quantity > 0) {
      this.db.list('/godowns/' + key + '/items').update(id, { quantity: quantity - 1 });
    }
  }

  delete(key, id) {
    this.db.list('/godowns/' + key + '/items').remove(id);
  }

}

export interface Item {
  $key: string;
  name: string;
  quantity: number;
}

export interface GoDown {
  $key: string;
  name: string;
  items: Item[];
}