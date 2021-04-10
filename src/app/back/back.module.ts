import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackRoutingModule } from './back-routing.module';
import { IonicModule } from '@ionic/angular';
import { TabsPageModule } from './tabs/tabs.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    BackRoutingModule,
    TabsPageModule,
    OrdersModule,
    ChatModule,
    PaymentsModule
  ]
})
export class BackModule { }
