import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { IonicModule } from '@ionic/angular';
import { OrderListComponent } from './_pages/order-list/order-list.component';
import { OrderDetailsComponent } from './_pages/order-details/order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalOrderComponent } from './_pages/modal-order/modal-order.component';
import { ModalMapComponent } from './_pages/modal-map/modal-map.component';
import { OrderInfoComponent } from './_pages/order-info/order-info.component';
import { AcceptedListComponent } from './_pages/accepted-list/accepted-list.component';
@NgModule({
  declarations: [OrderListComponent,OrderDetailsComponent,ModalOrderComponent,ModalMapComponent,OrderInfoComponent,AcceptedListComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    IonicModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class OrdersModule { }
