import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommissionComponent } from './_pages/commission/commission.component';
import { ComissionDetailsComponent } from './_pages/commission/comission-details/comission-details.component';

@NgModule({
  declarations: [CommissionComponent,ComissionDetailsComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    IonicModule
  ]
})
export class PaymentsModule { }
