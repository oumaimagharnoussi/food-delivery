import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailsComponent } from './_pages/order-details/order-details.component';
import { OrderInfoComponent } from './_pages/order-info/order-info.component';
import { OrderListComponent } from './_pages/order-list/order-list.component';

const routes: Routes = [
  {
    path:'',
    component:OrderListComponent
  },
  {
    path:'details/:id',
    component:OrderDetailsComponent
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
