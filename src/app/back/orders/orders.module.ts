import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { IonicModule } from '@ionic/angular';
import { OrderListComponent } from './_pages/order-list/order-list.component';
import { OrderDetailsComponent } from './_pages/order-details/order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [OrderListComponent,OrderDetailsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    IonicModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class OrdersModule { }
