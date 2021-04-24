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


@NgModule({
  declarations: [RegisterComponent,LoginComponent,HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    FrontRoutingModule,
    HttpClientModule,
    FormsModule,
   
    IonicStorageModule.forRoot()
  ]
})
export class FrontModule { }
