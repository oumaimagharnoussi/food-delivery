import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailsComponent } from './_pages/order-details/order-details.component';
import { OrderListComponent } from './_pages/order-list/order-list.component';

const routes: Routes = [
  {
    path:'',
    component:OrderListComponent
  },
  {
    path:'details/:id',
    component:OrderDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
