import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_pages/home/home.component';
import { PaymentinfoComponent } from './_pages/paymentinfo/paymentinfo.component';
import { PayoutListComponent } from './_pages/payout-list/payout-list.component';
import { ProfileComponent } from './_pages/profile/profile.component';


const routes: Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'payout',
    component:PayoutListComponent
  }
  ,
  {
    path:'add',
    component:PaymentinfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
