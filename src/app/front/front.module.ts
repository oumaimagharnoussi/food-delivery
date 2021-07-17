import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FrontRoutingModule } from './front-routing.module';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './_pages/register/register.component';
import { LoginComponent } from './_pages/login/login.component';
import { HomeComponent } from './_pages/home/home.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';
import { ForgetPasswordComponent } from './_pages/forget-password/forget-password.component';
import { PhoneVerifyComponent } from './_pages/phone-verify/phone-verify.component';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';


@NgModule({
  declarations: [RegisterComponent,
    LoginComponent,
    HomeComponent,
    ForgetPasswordComponent,
    PhoneVerifyComponent],
  imports: [
    CommonModule,
    IonicModule,
    FrontRoutingModule,
    HttpClientModule,
    FormsModule,
    IonIntlTelInputModule,
   
    IonicStorageModule.forRoot()
  ]
})
export class FrontModule { }
