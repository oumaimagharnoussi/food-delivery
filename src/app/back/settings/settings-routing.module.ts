import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressInfoComponent } from './_pages/address-info/address-info.component';
import { HomeComponent } from './_pages/home/home.component';
import { PasswordResetComponent } from './_pages/password-reset/password-reset.component';
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
    path:'password-reset',
    component:PasswordResetComponent
  },
  {
    path:'payout',
    component:PayoutListComponent
  }
  ,
  {
    path:'add',
    component:PaymentinfoComponent
  },
  {
    path:'address',
    component: AddressInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
