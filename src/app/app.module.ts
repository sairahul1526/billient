import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatIconModule, MatAutocompleteModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatTabsModule, MatExpansionModule, MatCardModule, MatMenuModule } from '@angular/material';

import { AppComponent, AddContactDialog } from './app.component';
import { ItemsComponent, EditItemDialog, AddItemDialog } from './pages/items/items.component';
import { BillingComponent } from './pages/billing/billing.component';
import { GodownComponent } from './pages/godown/godown.component';
import { DebtsComponent } from './pages/debts/debts.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    EditItemDialog,
    AddItemDialog,
    ItemsComponent,
    BillingComponent,
    GodownComponent,
    DebtsComponent,
    ContactsComponent,
    AddContactDialog
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatIconModule, MatAutocompleteModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatTabsModule, MatExpansionModule, MatCardModule, MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EditItemDialog, AddItemDialog, AddContactDialog]
})
export class AppModule { }
