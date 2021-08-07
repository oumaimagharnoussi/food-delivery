import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './_guards/auth-guard.service';
import { ForgetPasswordComponent } from './_pages/forget-password/forget-password.component';
import { HomeComponent } from './_pages/home/home.component';
import { LoginComponent } from './_pages/login/login.component';
import { PhoneVerifyComponent } from './_pages/phone-verify/phone-verify.component';
import { RegisterComponent } from './_pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: HomeComponent
    
    
  },
  {
    path: 'forget',
    pathMatch: 'full',
    component: ForgetPasswordComponent,
  },

  {
    path: 'phone-verify',
    pathMatch: 'full',
    component: PhoneVerifyComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontRoutingModule { }
