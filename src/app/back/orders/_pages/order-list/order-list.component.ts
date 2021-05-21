import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, IonContent, MenuController, ModalController, Platform } from '@ionic/angular';
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
  constructor(public alertController: AlertController,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private sse:SseService,
    private platform: Platform,
    private storage: AuthService,
    private order_service:OrderService, 
    private geolocation: Geolocation,
    private messagin:MessagingService,
    private menu: MenuController,
    public modalController: ModalController) { 

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
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
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
  }
  detail(id){
    this.router.navigate(['/orders/info/'+id])
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
async  getOrders(user) {
 
      this.order_service.getOrders(user).subscribe((data: any[]) => {
      
        this.orders=data;
        this.attempts=0
        this.changeRef.detectChanges();
     //   console.log(this.orders)
       
      },err=>{
        if(this.attempts<10){
          this.getOrders(user)
          this.attempts++;
        }else{
          console.log("problem with your backend")
          
        }
       
      })


    

    
       
   
   }

 async ngOnInit() {
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
        await  this.storage.getUser().then((response) => {
          if (response) { 
            this.getOrders(response.data);

          }
        });
      });
    }
  );
 

  this.platform.ready().then(async() => {
    await  this.storage.getUser().then((response) => {

     
      if (response) { 

     
          this.sse.GetExchangeData(environment.BACK_API_WPA+'/.well-known/mercure?topic='+environment.BACK_API_WPA+'/api/orders/{id}');
        
            this.getOrders(response.data);

      }
    });
  });

  //TODO
  /*
  this.geolocation.getCurrentPosition().then(async (resp) => {

    if(!this.platform.is('desktop')&&!this.platform.is('mobileweb')){
      await  this.storage.getUser().then((response) => {
        let data=JSON.parse(response.data);
        this.http.setServerTrustMode("nocheck");
        this.http.sendRequest(environment.BACK_API_MOBILE+"/api/deliveries/"+data.data.id,{method:"put"
      ,data:{
        currentLongitude: resp.coords.longitude,
        currentLatitude: resp.coords.latitude
      }, serializer:"json"})},
        ).then(
          ()=>{
            console.log("location updated")
          }
        )
      
      

    }

    console.log(resp.coords.latitude)
    console.log(resp.coords.longitude)
   }).catch((error) => {
     console.log('Error getting location', error);
   });
   
   let watch = this.geolocation.watchPosition();
   watch.subscribe((data) => {
    // data can be a set of coordinates, or an error (if an error occurred).
    // data.coords.latitude
    // data.coords.longitude
    console.log(data,"ddddddddddd")
    if(!this.platform.is('desktop')&&!this.platform.is('mobileweb')){
    this.platform.ready().then(async() => {

      await  this.storage.getUser().then((response) => {
        let data=JSON.parse(response.data);
        this.http.setServerTrustMode("nocheck");
        this.http.sendRequest(environment.BACK_API_MOBILE+"/api/deliveries/"+data.data.id,{method:"put"
      ,data:{
        currentLongitude: data.coords.longitude,
        currentLatitude: data.coords.latitude
      }, serializer:"json"})},
        ).then(
          ()=>{
            console.log("location updated")
          }
        )

    });
  }
    
   });*/



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



  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}

}