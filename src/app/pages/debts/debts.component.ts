import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MatDialog } from '@angular/material';

import { EditItemDialog } from '../items/items.component';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css']
})
export class DebtsComponent implements OnInit {

  displayedColumns = ['payment', 'date', 'id'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  customers: Customer[];
  filteredCustomers: Customer[];

  step = 0;

  filterValue = "";

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.filteredCustomers = this.customers.filter((customer) => customer.name.toLowerCase().includes(filterValue));
  }

  setStep(index: number) {
    this.step = index;
  }

  constructor(private db: AngularFireDatabase, public dialog: MatDialog) {
    this.db.list('/debts').snapshotChanges()
      .subscribe(actions => {
        this.customers = [];
        actions.forEach(action => {
          this.customers.push({$key: action.key, name: action.payload.val()['name'], payments: action.payload.val()['payments'] ? Object.values(action.payload.val()['payments']) : []});
        });
        this.applyFilter(this.filterValue);
      });
  }

  add(customer, swi) {
    console.log(customer);
    if (swi == 1) {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: customer.name, change: "Add Debt", type: "number", var: "" }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          let pushed = this.db.list('/debts/' + customer.$key + '/payments').push({ payment: -Number(result.var), date: String(new Date()) });
          this.db.list('/debts/' + customer.$key + '/payments').update(pushed.key, { id: pushed.key });
        }
      });
    } else if (swi == 2) {
      let dialogRef = this.dialog.open(EditItemDialog, {
        width: '250px',
        data: { name: customer.name, change: "Add Payment", type: "number", var: "" }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.var) {
          let pushed = this.db.list('/debts/' + customer.$key + '/payments').push({ payment: Number(result.var), date: String(new Date()) });
          this.db.list('/debts/' + customer.$key + '/payments').update(pushed.key, { id: pushed.key });
        }
      });
    } else {
      this.db.list('/debts/' + customer.$key + '/payments').remove();
    }
  }

  delete(key, id) {
    this.db.list('/debts/' + key + '/payments').remove(id);
  }

  getTotal(payments) {
    var total = 0;
    payments.forEach(payment => {
      total += payment.payment;
    });
    return total;
  }

}

export interface Payment {
  $key: string;
  payment: number;
  date: string;
}

export interface Customer {
  $key: string;
  name: string;
  payments: Payment[];
}