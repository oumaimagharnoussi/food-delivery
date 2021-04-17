import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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

  constructor(private storage: AuthService,private order_service:OrderService, private geolocation: Geolocation,private messagin:MessagingService) { 
    this.messagin.getMessages()
     
  }

  getOrders(id) {
   
 
    this.order_service.getOrders(id).subscribe((data: any[]) => {
      
         this.orders=data;
         console.log(this.orders)
        
       })
    
       
   
   }

 async ngOnInit() {

  await this.storage.getUser().then(
    value=>{
      this.getOrders(value.data.id);
    }
  )

  
  this.geolocation.getCurrentPosition().then((resp) => {

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
