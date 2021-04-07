import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
