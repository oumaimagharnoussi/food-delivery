import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { MessagingService } from 'src/app/front/_services/messaging.service';
import { OrderService } from '../../_services/order.service';
import { SseService } from '../../_services/sse.service';
import { ChangeDetectorRef } from '@angular/core'
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
import { Router } from '@angular/router';
const { PushNotifications } = Plugins;
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  dark=false;
  orders=[];
user;
  constructor(public alertController: AlertController,private router: Router,private changeRef: ChangeDetectorRef,private sse:SseService,private platform: Platform,private http: HTTP,private storage: AuthService,private order_service:OrderService, private geolocation: Geolocation,private messagin:MessagingService) { 
    this.messagin.getMessages()
     
  }

  async accept(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure delivering order',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
  
    await alert.present();
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
  getOrders(id) {
    if(this.platform.is("desktop")||this.platform.is("mobileweb")){
      this.order_service.getOrders(id).subscribe((data: any[]) => {
      
        this.orders=data;
     //   console.log(this.orders)
       
      })


    }else{
 
      this.http.setServerTrustMode("nocheck");

      this.http.sendRequest('http://10.0.2.2:8000/api/nearby_orders/'+id ,{method: "get"
      ,serializer:"json",responseType:"json"}).then((data) => {
        
           this.orders=data.data;
           this.changeRef.detectChanges();
           console.log(this.orders)
          
         })
    }
   

    
       
   
   }

 async ngOnInit() {
  if(!this.platform.is("mobileweb")&&!this.platform.is("desktop")){
    this.listen();
  }
 

  this.sse.returnAsObservable().subscribe(data=>
    {
      this.platform.ready().then(async() => {
        await  this.storage.getUser().then((response) => {
    
         
          if (response) { 
    
            if(this.platform.is("mobileweb")||this.platform.is("desktop")){
            //  this.sse.GetExchangeData('http://127.0.0.1:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');
    
              this.getOrders(response.data.id);
            }else{
              //this.sse.GetExchangeData('http://10.0.2.2:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');
              console.log(response)
              //  this.user=response.data
               // console.log(response.data.data)
                let data=JSON.parse(response.data)
               // console.log(data)
                this.getOrders(data.data.id);
            }
    
    
    
    
          }else{
           // this.router.navigate(['/login'])
          }
        });
      });
    }
  );
 

  this.platform.ready().then(async() => {
    await  this.storage.getUser().then((response) => {

     
      if (response) { 

        if(this.platform.is("mobileweb")||this.platform.is("desktop")){
          this.sse.GetExchangeData('http://127.0.0.1:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');

          this.getOrders(response.data.id);
        }else{
          this.sse.GetExchangeData('http://10.0.2.2:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');
          console.log(response)
          //  this.user=response.data
           // console.log(response.data.data)
            let data=JSON.parse(response.data)
           // console.log(data)
            this.getOrders(data.data.id);
        }




      }else{
       // this.router.navigate(['/login'])
      }
    });
  });


  
  this.geolocation.getCurrentPosition().then(async (resp) => {

    if(!this.platform.is('desktop')&&!this.platform.is('mobileweb')){
      await  this.storage.getUser().then((response) => {
        let data=JSON.parse(response.data);
        this.http.setServerTrustMode("nocheck");
        this.http.sendRequest("http://10.0.2.2:8000/api/deliveries/"+data.data.id,{method:"put"
      ,data:{
        currentLongitude: resp.coords.longitude,
        currentLatitude: resp.coords.latitude
      }, serializer:"json"})},
        ).then(
          ()=>{
            console.log("location updated")
          }
        )
      
      

    }else{

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
        this.http.sendRequest("http://10.0.2.2:8000/api/deliveries/"+data.data.id,{method:"put"
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
    
   });



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
