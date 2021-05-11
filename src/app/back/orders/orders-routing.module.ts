import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderInfoComponent } from './_pages/order-info/order-info.component';
import { OrderListComponent } from './_pages/order-list/order-list.component';

const routes: Routes = [
  {
    path:'',
    component:OrderListComponent
  },
  {
    path:'info/:id',
    component:OrderInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
