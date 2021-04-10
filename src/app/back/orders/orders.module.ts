import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { IonicModule } from '@ionic/angular';
import { OrderListComponent } from './_pages/order-list/order-list.component';

@NgModule({
  declarations: [OrderListComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    IonicModule
  ]
})
export class OrdersModule { }
