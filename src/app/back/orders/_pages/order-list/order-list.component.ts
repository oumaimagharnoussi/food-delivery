import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, IonContent, LoadingController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { MessagingService } from 'src/app/front/_services/messaging.service';
import { OrderService } from '../../_services/order.service';
import { SseService } from '../../_services/sse.service';
import { ChangeDetectorRef } from '@angular/core'
import {environment} from 'src/environments/environment'
import { 
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';


import { Router } from '@angular/router';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import { NearbyOrdersService } from '../../_services/nearby-orders.service';
import { DeliveryService } from 'src/app/back/settings/_services/delivery.service';
import { MailConfirmService } from 'src/app/front/_services/mail-confirm.service';
import { CommissionComponent } from 'src/app/back/payments/_pages/commission/commission.component';
import { PhoneVerifyComponent } from 'src/app/front/_pages/phone-verify/phone-verify.component';
import { AvailabilityService } from 'src/app/back/_services/availability.service';

import { OrderDetailsComponent } from '../order-details/order-details.component';

const { PushNotifications } = Plugins;
const {Network} =Plugins;
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  dark=false;
  new=true;
  orders=[];
  user;
  backToTop: boolean = false;
  offline:boolean;
  attempts=0;
  primaryColor="#bdd0da"
  token: string;
  error: any=[];
  delivery: any;
  loading: HTMLIonLoadingElement;
  constructor(public alertController: AlertController,
    private router: Router,
    private alertCtrl: AlertController,
    private changeRef: ChangeDetectorRef,
    private sse:SseService,
    private platform: Platform,
    private auth_service: AuthService,
    private messagin:MessagingService,
    private menu: MenuController,
    public modalController: ModalController,
    private nearby_service: NearbyOrdersService,
    private delivery_serv: DeliveryService,
    private mailConfirm_serv: MailConfirmService,
    private toastCtrl: ToastController,
    private availability_serv :AvailabilityService,
    public loadingController: LoadingController
    
    ) { 
      

      this.platform.ready().then(async() => {
         this.requestMessaginToken();
       
        });
        
     
       
      

     

    let handler=Network.addListener('networkStatusChange',async(status)=>{
      if (status.connected){
   
     this.offline=false;
     this.changeRef.detectChanges();
      }else{
     
       this.offline=true
       this.changeRef.detectChanges();
      }
     })
    this.messagin.getMessages()
     
  }



  async updateTokenDevice(user,FCM_token){

    this.user=user
    console.log(user)
    
  return this.delivery_serv.updateDelivery(user,{deviceToken: FCM_token}).subscribe(
    ()=>{
     
     //window.location.href = "/app/orders";
    }
 
  )
 
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  async presentVerificationModal(phone_number) {
    const modal = await this.modalController.create({
      component: PhoneVerifyComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'telephone': {
          number: phone_number
          
        }
      }
    });
    return await modal.present();
  }

  async presentModal(order) {
    const modal = await this.modalController.create({
      component: ModalMapComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'source': {
          lat: 35.38303302544718,
          lng: 8.902773358214844
        },
        'destination': {
          lat: 35.48303302544718,
          lng: 8.702773358214844
        }
      }

    });
    return await modal.present();
  }

  gotToTop() {
    this.content.scrollToTop(1400);
  }
  async doRefresh(event) {
    let status=await Network.getStatus();
    if(status.connected){
      console.log('Begin async operation');
      this.orders.length=0;
      this.ngOnInit().then(
        ()=>{
          event.target.complete();
        }
      )
    }
    else{
      event.target.complete();
    }
  }
  loadData(event) {
    let size=this.orders.length
    setTimeout( () => {
      console.log('Done');
    
    
      event.target.complete();
   
    if (true) {
      event.target.disabled = true;
    }
      // App logic to determine if all data is loaded
      // and disable the infinite scroll

    }, 500);

  }
  change(){
    if(this.dark==true){
      this.dark=false
    }else{
      this.dark=true
    }
  }

  showAcceptedOrders(){
    this.new=false;
  }
  showNewOrders(){
    this.new=true;
    this.ngOnInit().then(()=>{

    })
    
  }
  async showDetails(order) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      mode: 'ios',
      translucent: true
    });
    await loading.present();

    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'order': order,
        'delivery': this.delivery
      }
    });
    modal.onWillDismiss().then(()=>{
      this.ngOnInit().then(
        ()=> {

        }
      )
    })
    return await modal.present().then(()=>{
      loading.dismiss();
      console.log('Loading dismissed!');

    });
  }



  async showMessage(message,color){
    
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      color: color,
      position: 'bottom'
    });
    toast.present();
}
  listen(){
             // On success, we should be able to receive notifications
             PushNotifications.addListener('registration',
             (tokenF: PushNotificationToken) => {
             //  alert('Push registration success, token: ' + tokenF.value);
              
       
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
               let id=JSON.stringify(notification.notification.data.id);
               console.log(id)
              // alert('Push action performed: ' + JSON.stringify(notification.notification.data));
               this.router.navigate(['/orders/details/'+id.toString().substring(1,id.toString().length-1)])
              // alert('Push action performed: ' + JSON.stringify(notification.notification.data.id));
             }
           );
  }

  sendMailConfirm(){
    this.mailConfirm_serv.sendConfirmation(this.user.id).subscribe(
      res=>{ 
        this.showMessage("check your inbox","success")
        

      }
      
    )

  }
async  getOrders(user) {
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Please wait...',
    mode: 'ios',
    translucent: true
  });
  await loading.present();

  
 
      this.nearby_service.getNearbyOrders(user).subscribe(async(data) => {
        loading.dismiss();
        console.log('Loading dismissed!');
          if(data.errors){
            this.error=data.errors;
          }else{
            this.attempts=0
            this.changeRef.detectChanges();
            this.orders=data;
            
          }
         
        
    
   
     //   console.log(this.orders)
       
      },async (err)=>{
        loading.dismiss();
        console.log('Loading dismissed!');
        if(this.attempts<10){
          this.getOrders(user)
          this.attempts++;
        }else{
          console.log("problem with your backend")
          
        }
       
      })


    

    
       
   
   }

 async ngOnInit() {
   this.availability_serv.change.subscribe(isOnline=>{

     if(isOnline==true){
       this.goOnline();
     }

     if(isOnline==false){
      this.goOffline();
    }



   });

   
  let status=await Network.getStatus();
  if(status.connected){
  
    this.offline=false;
    this.changeRef.detectChanges();
  }else{
    this.offline=true;
    this.changeRef.detectChanges();
  
  }
  
  if(!this.platform.is("mobileweb")&&!this.platform.is("desktop")){
    this.listen();
  }
 

  this.sse.returnAsObservable().subscribe(data=>
    {
      this.platform.ready().then(async() => {
        await  this.auth_service.getUser().then((response) => {
          if (response) { 
            this.getOrders(response);

            this.delivery_serv.getDelivery(response.data).subscribe(
              data=>{
                this.delivery=data
                if(data.isPhoneVerified==false || data.isPhoneVerified==null){
                  this.presentVerificationModal(data.telephone);
                }
      
               
              }
            )

          }
        });
      });
    }
  );
 

  this.platform.ready().then(async() => {
    await  this.auth_service.getUser().then((response) => {

      

     
      if (response) { 
        console.log(response,"eeeeeeeeeee") 
     
 //         this.sse.GetExchangeData('https://food.dev.confledis.fr:3000/.well-known/mercure?topic=https://food.dev.confledis.fr/api/orders/{id}');
        
            this.getOrders(response);

      }
    });
  });

  
    await this.auth_service.getDark().then((test)=>{
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



  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}

async requestMessaginToken(){
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
         async    (tokenF: PushNotificationToken) => {
             this.auth_service.set('fcm',tokenF)  
             this.auth_service.setFcmToken(tokenF);

             await  this.auth_service.getUser().then(async(response) => {
              if (response) { 
                
                    this.updateTokenDevice(response.data,tokenF.value)
                  
              }})

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
   this.messagin.requestPermission().subscribe(
     async tokenF => {
       this.auth_service.set('fcm',tokenF)  
       this.auth_service.setFcmToken(tokenF);

       await  this.auth_service.getUser().then(async(response) => {
        if (response) { 
          
              this.updateTokenDevice(response.data,tokenF)
            
        }})
    
       this.listenForMessages();
       

      
       
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

listenForMessages() {
  this.messagin.getMessages().subscribe(async (msg: any) => {
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

goOnline(){
  this.delivery_serv.updateDelivery(this.delivery,{status:'AVAILABLE'}).subscribe(
    (data)=>{
      this.delivery=data;

      this.platform.ready().then(async() => {
        await  this.auth_service.getUser().then((response) => {
          if (response) { 
            this.getOrders(response);

          }
        });
      });
      
    }
 
  )
}

goOffline(){ 
  this.delivery_serv.updateDelivery(this.delivery,{status:'DONT_DISTURB'}).subscribe(
    (data)=>{
      this.delivery=data;
      this.orders.length=0;
      
    }
 
  )
}
}