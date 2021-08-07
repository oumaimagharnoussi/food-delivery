import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { IonicModule } from '@ionic/angular';
import { OrderListComponent } from './_pages/order-list/order-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalMapComponent } from './_pages/modal-map/modal-map.component';
import { AcceptedListComponent } from './_pages/accepted-list/accepted-list.component';
import { TextAvatarModule } from 'src/app/text-avatar/text-avatar.module';
import { OrderDetailsComponent } from './_pages/order-details/order-details.component';

@NgModule({
  declarations: [OrderListComponent,
    ModalMapComponent,

    AcceptedListComponent,
  OrderDetailsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    IonicModule,
    FormsModule,ReactiveFormsModule,
    TextAvatarModule

  ]
})
export class OrdersModule { }
