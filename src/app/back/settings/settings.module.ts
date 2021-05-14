import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './_pages/home/home.component';
import { PaymentinfoComponent } from './_pages/paymentinfo/paymentinfo.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { PayoutListComponent } from './_pages/payout-list/payout-list.component';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

@NgModule({
  declarations: [HomeComponent,PaymentinfoComponent,ProfileComponent,PayoutListComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    IonIntlTelInputModule

  ]
})
export class SettingsModule { }
