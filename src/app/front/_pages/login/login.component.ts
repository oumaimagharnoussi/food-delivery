import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

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


  constructor(private authService:AuthService, private router: Router,private platform: Platform) { }

  async ngOnInit() {
    this.authService.ifNotLoggedIn()
    await this.authService.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

  }
  login(){
    

    this.authService.login(this.loginForm)
    .subscribe((token: any) => {
      this.pressed=true;
      this.err=false
      if(this.platform.is('android'))
      {
        console.log('Initializing HomePage');
  
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
          (token: PushNotificationToken) => {
            alert('Push registration success, token: ' + token.value);
            this.token=token.value;
            this.authService.set("tokenDevice",this.token)
    
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
            alert('Push received: ' + JSON.stringify(notification));
          }
        );
    
        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: PushNotificationActionPerformed) => {
            alert('Push action performed: ' + JSON.stringify(notification));
          }
        );
    
    
      }
      this.platform.ready().then(async() => {
        this.authService.set('access_token',token)
        this.router.navigate(['/app/orders'])
      }
      );
    
      
    console.log(token)
    },error=>{
      this.pressed=true;
      this.err=true;
      this.errMsg="Verify your credentials!"

    }
    );
  
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

}
