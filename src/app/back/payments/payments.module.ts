import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommissionComponent } from './_pages/commission/commission.component';

@NgModule({
  declarations: [CommissionComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    IonicModule
  ]
})
export class PaymentsModule { }
