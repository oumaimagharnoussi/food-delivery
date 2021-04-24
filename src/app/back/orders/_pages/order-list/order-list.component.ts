import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { MessagingService } from 'src/app/front/_services/messaging.service';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  dark=false;
  orders=[];
user;
  constructor(private platform: Platform,private http: HTTP,private storage: AuthService,private order_service:OrderService, private geolocation: Geolocation,private messagin:MessagingService) { 
    this.messagin.getMessages()
     
  }

  getOrders(id) {
    if(this.platform.is("desktop")||this.platform.is("mobileweb")){

      this.order_service.getOrders(id).subscribe((data: any[]) => {
      
        this.orders=data;
        console.log(this.orders)
       
      })

    }else{
 
      this.http.setServerTrustMode("nocheck");

      this.http.sendRequest('https://10.0.2.2:8000/api/nearby_orders/'+id ,{method: "get"
      ,serializer:"json",responseType:"json"}).then((data) => {
        
           this.orders=data.data;
           console.log(this.orders)
          
         })
    }
   

    
       
   
   }

 async ngOnInit() {


  this.platform.ready().then(async() => {
    await  this.storage.getUser().then((response) => {

     
      if (response) { 

        if(this.platform.is("mobileweb")||this.platform.is("desktop")){

          this.getOrders(response.data.id);
        }else{
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
        this.http.sendRequest("https://10.0.2.2:8000/api/deliveries/"+data.data.id,{method:"put"
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
        this.http.sendRequest("https://10.0.2.2:8000/api/deliveries/"+data.data.id,{method:"put"
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
