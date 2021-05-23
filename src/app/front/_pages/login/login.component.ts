import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';
import {environment} from 'src/environments/environment'
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { MessagingService } from '../../_services/messaging.service';
import { DeliveryService } from 'src/app/back/settings/_services/delivery.service';
import { Observable } from 'rxjs';

const { PushNotifications } = Plugins;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errMsg= ""
  err=false;
  pressed=false;
  dark=false;
  token="";

  loginForm = {
    username:'',
    password:''
  };


  constructor(    
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private messagingService: MessagingService, 
    private authService:AuthService,
    private router: Router,
    private platform: Platform,
    private delivery_serv: DeliveryService) { 

      }


  listenForMessages() {
    this.messagingService.getMessages().subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title ,
        subHeader: msg.notification.body,
        message: msg.data.info,
        buttons: [ 'OK',   
        ],
      });
 
      await alert.present();
    });
  }
  async ngOnInit() {
    this.authService.ifNotLoggedIn()
    await this.authService.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

  }


 authenticate(){
   //call auth service
   let data=   {
    username:  this.loginForm.username.toString(),
    password: this.loginForm.password.toString()
  }
  this.authService.login(data)
  .subscribe((token: any) => {
    //initialise form control
    this.pressed=true;
    this.err=false
    //request FCM token
    this.saveToken(token).then(
      ()=>{
        this.requestMessaginToken(token.data)
      }
    )

  },err=>{
    this.pressed=true;
    this.err=true;
    this.errMsg="Verify your credentials!"

  });

 }

 async saveToken(token){
  this.platform.ready().then(async() => {
    this.authService.set('access_token',token)  
  })
 }

 async requestMessaginToken(user:any){
   if(this.platform.is('capacitor')){
          // Request permission to use push notifications
          // iOS will prompt user and return if they granted permission or not
          // Android will just grant without prompting
          PushNotifications.requestPermission().then( result => {
            if (result.granted) {
              // Register with Apple / Google to receive push via APNS/FCM
              PushNotifications.register();
            } else {
              // Show some error
            }
          });
      
          // On success, we should be able to receive notifications
          PushNotifications.addListener('registration',
            (tokenF: PushNotificationToken) => {
            //  alert('Push registration success, token: ' + tokenF.value);
            let info=JSON.parse(user)
              this.updateTokenDevice(info.data.id,tokenF.value)

            }
          );
      
          // Some issue with our setup and push will not work
          PushNotifications.addListener('registrationError',
            (error: any) => {
              alert('Error on registration: ' + JSON.stringify(error));
            }
          );
      
          // Show us the notification payload if the app is open on our device
          PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotification) => {
              //alert('Push received: ' + JSON.stringify(notification));
            }
          );
      
          // Method called when tapping on a notification
          PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
              let id=JSON.stringify(notification.notification.data);
              this.router.navigate(['/orders/details/'+id.toString().substring(1,id.toString().length-1)])
              console.log(id)
         
            }
          );

          

   }else{
    this.messagingService.requestPermission().subscribe(
      async tokenF => {
        this.listenForMessages();
        this.token=tokenF;
        this.updateTokenDevice(user,tokenF)
        const toast = await this.toastCtrl.create({
          message: 'Got your token',
          duration: 2000
        });
        toast.present();
      },
      async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );

   }
 }

async updateTokenDevice(user,FCM_token){
   let data={
    deviceToken: FCM_token
   }
 return this.delivery_serv.updateDelivery(user,data).subscribe(
   ()=>{
    
    window.location.href = "/app/orders";
   }

 )

 }

 onClick(event){
  let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.addListener(this.colorTest);
  if(event.detail.checked){
    document.body.setAttribute('data-theme', 'dark');
    this.authService.set("dark",true)
  }
  else{
    document.body.setAttribute('data-theme', 'light');
    this.authService.set("dark",false)
  }
}

 colorTest(systemInitiatedDark) {
  if (systemInitiatedDark.matches) {
    document.body.setAttribute('data-theme', 'dark');		
  } else {
    document.body.setAttribute('data-theme', 'light');
  }
}

redirect(route){
  this.router.navigate([route])
}


}