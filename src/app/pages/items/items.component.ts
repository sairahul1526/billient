import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  displayedColumns = ['name', 'price', 'id'];
  dataSource: MatTableDataSource<ItemData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  items: any[];

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    this.db.list('/items').snapshotChanges()
      .subscribe(actions => {
        this.items = [];
        actions.forEach(action => {
          let temp = action.payload.val();
          this.items.push({$key: action.key, name: temp['name'], quantity: temp['quantity'], price: temp['price']})
        });
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    this.db.list('/items').remove(item.$key);
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
          this.db.list('/items').update(item.$key, { name: result.var });
        }
      });
    } else if (changeCol == 2) {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: item.name, change: "Edit weight", type: "text", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.db.list('/items').update(item.$key, { quantity: result.var });
        }
      });
    } else {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: item.name, change: "Edit price", type: "number", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.db.list('/items').update(item.$key, { price:  Number(result.var) });
        }
      });
    }
  }
}

export interface ItemData {
  $key: string;
  name: string;
  quantity: string;
  price: number;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>{{data.name}}</h1>
  <div mat-dialog-content>
    <p>{{ data.change }}</p>
    <mat-form-field>
      <input matInput [(ngModel)]="data.var" [type]="data.type" (keydown.enter)="save()">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button (click)="save()">Ok</button>
  </div>`,
})
export class EditItemDialog {

  constructor(
    public dialogRef: MatDialogRef<EditItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ var: this.data.var });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Add Item</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput placeholder="name" [(ngModel)]="data.name">
    </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="quantity" [(ngModel)]="data.quantity">
    </mat-form-field>
    <mat-form-field>
      <input matInput type="number" placeholder="price" [(ngModel)]="data.price" (keydown.enter)="save()">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button (click)="save()">Ok</button>
  </div>`,
})
export class AddItemDialog {

  constructor(
    public dialogRef: MatDialogRef<AddItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    if (this.data.name != "" && this.data.quantity != "" && this.data.price) {
      this.dialogRef.close(this.data);
    }
  }

}
