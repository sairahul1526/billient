import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { EditItemDialog } from '../items/items.component';

export interface ItemData {
  id: string;
  name: string;
  quantity: string;
  price: number;
}

export interface Item {
  id: string;
  name: string;
  quantity: string;
  price: number;
  amount: number;
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  ngOnInit() {
  }

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  states: any[] = [];

  displayedColumns = ['name', 'price', 'amount', 'total', 'id'];
  items: any[] = [];
  dataSource: MatTableDataSource<ItemData>;

  totalCost = 0;

  dialogOpen = false;

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    this.db.list('/items').valueChanges().subscribe(countries => {  
        this.states = countries;
    });
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.states.slice())
      );
  }

  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selected(event, state) {
    console.dir(state);
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.stateCtrl.setValue("");
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: state.name, change: "Add quantity", type: "number", var: "" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          this.dialogOpen = false;
          this.items.push({id: state.id, name: state.name, quantity: state.quantity, price: state.price, amount: result.var});
          this.dataSource = new MatTableDataSource(this.items);
          this.getTotal();
        }
      });
    }
  }

  getTotal() {
    this.totalCost = 0;
    this.items.forEach(item => {
      this.totalCost += item.amount * item.price;
    });
  }

  clear() {
    this.items = [];
    this.dataSource = new MatTableDataSource(this.items);
    this.totalCost = 0;
  }

  change(item, col, index) {
    switch (col) {
      case 1:
        let dialogRef = this.dialog.open(EditItemDialog, {
          width: '250px',
          data: { name: item.name, change: "Edit name", type: "text", var: "" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.var) {
            this.items[index].name = result.var;
            this.getTotal();
          }
        });
        break;
      case 2:
        dialogRef = this.dialog.open(EditItemDialog, {
          width: '250px',
          data: { name: item.name, change: "Edit weight", type: "text", var: "" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.var) {
            this.items[index].quantity = result.var;
            this.getTotal();
          }
        });
        break;
      case 3:
        dialogRef = this.dialog.open(EditItemDialog, {
          width: '250px',
          data: { name: item.name, change: "Edit price", type: "number", var: "" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.var) {
            this.items[index].price = result.var;
            this.getTotal();
          }
        });
        break;
      case 4:
        dialogRef = this.dialog.open(EditItemDialog, {
          width: '250px',
          data: { name: item.name, change: "Edit quantity", type: "number", var: "" }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.var) {
            this.items[index].amount = result.var;
            this.getTotal();
          }
        });
        break;
      default:
        break;
    }
  }

  delete(index) {
    this.items.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.items);
    this.getTotal();
  }

  print() {
    let popupWinindow
    popupWinindow = window.open('', '_blank', 'outerWidth=600,width=500,innerWidth=400,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write(`
    <html>
      <head>
        <style>
          @page {
              size: auto;
              margin: 0px;
              padding: 0px;
          }
          body {
              margin: 0px;
              padding: 0px;
          }
          table {
              margin: 0px;
              padding: 0px;
              font-family: arial, sans-serif;
              font-size: 10;
              border-collapse: collapse;
              width: 100%;
          }

          td, th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
          }

          tr:nth-child(even) {
              background-color: #dddddd;
          }

          table td:first-child {
              width: 100%;
              font-size:9;
          }
        </style>
      </head>
      <body onload="window.print()">
        <h4 style="text-align:center;margin:0px;padding:0px">SAI KRISHNA</h4>
        <h5 style="text-align:center;margin:0px;padding:0px">KIRANA & GENERAL STORES</h5>
        <p style="text-align:center;font-size: 10;margin-bottom:0px;padding-bottom:0px">3-9-62, Shah Bazar, Mahabubnagar - 509001</p>
        <p style="text-align:center;font-size: 10;margin-top:0px;padding-top:0px">Phone no: 08542-242893</p>
        <table>
          <tr>
            <th style="font-size:6px;text-align: center;">Name</th>
            <th style="font-size:6px;text-align: center;">Price</th>
            <th style="font-size:6px;text-align: center;">Quantity</th>
            <th style="font-size:6px;text-align: center;">Amount</th>`);

    this.items.forEach(item => {
      popupWinindow.document.write('<tr><td>' + item.name + '</td><td style="text-align: center;">' + item.price + '</td><td style="text-align: center;">' + item.amount + '</td><td style="text-align: center;">' + (item.amount*item.price) + '</td></tr>')
    });
    popupWinindow.document.write('<tr><td></td><td></td><td>Total</td><td>' + this.totalCost + '</td></tr></table></body></html>');
    popupWinindow.document.close();
  }

}
