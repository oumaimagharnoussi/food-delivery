import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { AuthService } from '../../_services/auth.service';
import { MessagingService } from '../../_services/messaging.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dark=false;
  pushes: any = [];
  token="";

  constructor(private storage: AuthService, private router: Router,
    private messagingService: MessagingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) { 
      this.listenForMessages()

  

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
 
  requestPermission() {
    this.messagingService.requestPermission().subscribe(
      async token => {
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
 
  async deleteToken() {
    this.messagingService.deleteToken();
    const toast = await this.toastCtrl.create({
      message: 'Token removed',
      duration: 2000
    });
    toast.present();
  }

 

  async ngOnInit() {






    // to check if we have permission
/*this.push.hasPermission()
.then((res: any) => {

  if (res.isEnabled) {
    console.log('We have permission to send push notifications');
  } else {
    console.log('We do not have permission to send push notifications');
  }

});*/

    this.storage.ifNotLoggedIn()
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
  
   await this.storage.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

}

onClick(event){
  let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.addListener(this.colorTest);
  if(event.detail.checked){
    document.body.setAttribute('data-theme', 'dark');
    this.storage.set("dark",true)
  }
  else{
    document.body.setAttribute('data-theme', 'light');
    this.storage.set("dark",false)
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
