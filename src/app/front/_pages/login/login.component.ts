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


  constructor(    private alertCtrl: AlertController,
    private toastCtrl: ToastController,private messagingService: MessagingService, private http: HTTP,private authService:AuthService, private router: Router,private platform: Platform) { }


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
  login(){

    if(this.platform.is('desktop') || this.platform.is('mobileweb')){

    this.authService.login(this.loginForm)
    .subscribe((token: any) => {
      this.pressed=true;
      this.err=false
      this.router.navigate(['/app/orders'])
      this.messagingService.requestPermission().subscribe(
        async tokenF => {
          this.listenForMessages();
          this.token=tokenF;
          this.router.navigate(['/app/orders'])
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
   
      this.platform.ready().then(async() => {

        this.listenForMessages();
        this.router.navigate(['/app/orders'])
        this.authService.set('access_token',token)
        //
      
      }
      );
    
      
    console.log(token)
    },error=>{
      this.pressed=true;
      this.err=true;
      this.errMsg="Verify your credentials!"

    }
    );


    }else{
      this.http.setServerTrustMode("nocheck");

      this.http.sendRequest(environment.BACK_API_MOBILE+'/api/login_check',{method: "post",data:
      {
  
  
        
        "username":  this.loginForm.username.toString(),
        "password": this.loginForm.password.toString()
      
      
      }
      ,serializer:"json"}).then((token: any) => {
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
            (tokenF: PushNotificationToken) => {
            //  alert('Push registration success, token: ' + tokenF.value);
              this.token=tokenF.value;
              this.authService.set("tokenDevice",this.token)
              
              let info=JSON.parse(token.data)
              this.http.sendRequest(environment.BACK_API_MOBILE+'/api/deliveries/'+info.data.id,{method: "put",data:
              {
          
                "deviceToken":  this.token,
                           
              
              }
              ,serializer:"json"})
      
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
          //   alert('Push action performed: ' + JSON.stringify(notification.notification.data));
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
