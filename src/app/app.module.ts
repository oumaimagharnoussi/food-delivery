import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FrontModule } from './front/front.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthService } from './front/_services/auth.service';
import { AuthGuardService } from './front/_guards/auth-guard.service';
import { Drivers, Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackModule } from './back/back.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Push } from '@ionic-native/push/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from './front/_services/messaging.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TextAvatarModule } from './text-avatar/text-avatar.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,FormsModule, ReactiveFormsModule, IonicModule.forRoot(), AppRoutingModule,FrontModule,BackModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true 
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).

    }),

  AngularFireModule.initializeApp(environment.firebase),
  AngularFireMessagingModule,
  TextAvatarModule
/* ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production
  })*/
],
  providers: [Network, AuthService ,HTTP,MessagingService, AuthGuardService,Geolocation, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
