import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComissionDetailsComponent } from './_pages/commission/comission-details/comission-details.component';
import { CommissionComponent } from './_pages/commission/commission.component';

const routes: Routes = [
  {
    path:'',
    component:CommissionComponent
  },
  {
    path:'details/:id',
    component:ComissionDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
