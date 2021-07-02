import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { MessagingService } from '../../_services/messaging.service';
import { DeliveryService } from 'src/app/back/settings/_services/delivery.service';


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
    private auth_service:AuthService,
    private router: Router,
    private platform: Platform,
    private delivery_serv: DeliveryService) { 
      this.auth_service.ifNotLoggedIn()

      }

      async showMessage(message,color){
    
        const toast = await this.toastCtrl.create({
          message: message,
          duration: 2000,
          color: color,
          position: 'bottom'
        });
        toast.present();
    }


  async ngOnInit() {
    
    await this.auth_service.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

  }
   ValidateEmail(mail) 
  {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
    {
      return (true)
    }
      
      return (false)
  }
  

 authenticate(){
   //call auth service
   let data=   {
    username:  this.loginForm.username.toString(),
    password: this.loginForm.password.toString()
  }
  if(data.username == "" ){
    this.pressed=true;

    this.showMessage("Username is required !","danger")
    return;
  }


  
  if(data.password == "" ){
    this.pressed=true;

    this.showMessage("Password is required !","danger")
    return;
  }
  this.auth_service.login(data)
  .subscribe((token: any) => {
    //initialise form control
    this.pressed=true;
    this.err=false
    //request FCM token
    this.saveToken(token);
    window.location.href = "/app/orders";

  },err=>{
    this.pressed=true;
    this.err=true;
    console.log(err)
    this.showMessage(err.error.message,"danger")

  });

 }

 async saveToken(token){
  this.platform.ready().then(async() => {
    console.log("save token this : ",token)
    if(this.platform.is('capacitor')){
      let data=JSON.parse(token.data)
      this.auth_service.set('access_token',data)  
      this.auth_service.token=data;
      
    }else{
      this.auth_service.set('access_token',token)  
      this.auth_service.token=token; 
    }
    
  })
  
 }





 onClick(event){
  let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.addListener(this.colorTest);
  if(event.detail.checked){
    document.body.setAttribute('data-theme', 'dark');
    this.auth_service.set("dark",true)
  }
  else{
    document.body.setAttribute('data-theme', 'light');
    this.auth_service.set("dark",false)
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