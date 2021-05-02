import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { OrderService } from '../../_services/order.service';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
})
export class OrderInfoComponent implements OnInit {
  orderId;
  order: any;
  destination = {
    lat: 35.38303302544718,
    lng: 8.902773358214844
  };
  source = {
    lat: 35.38303302544718,
    lng: 8.902773358214844
  };
  delivery: any;

  constructor(private platform:Platform,
     private http: HTTP,
      private order_service:OrderService,
      public alertController: AlertController,
      public modalController: ModalController,
      private auth:AuthService) { 
    this.orderId=this.getUrl()
   
  }

  ngOnInit() {
    this.getOrder(this.orderId)

    this.platform.ready().then(async() => {
     
      await  this.auth.getUser().then((response) => {
        if(this.platform.is("desktop")||this.platform.is("mobileweb")){
        this.getInfo(response.data.id);
        }else{

          let data=JSON.parse(response.data)
          this.getInfo(data.data.id);
        }

      })

 

      
    });
  }
  getUrl(){
    let a=window.location.pathname.toString();
    let b=-1;

    for(let i=a.length-1;i>-1;i--){
      if(a[i]=='/') {b=i
        break;}
    }
    return Number (a.slice(b+1,a.length));
  }

  getOrder(id) {
    if(!this.platform.is("desktop")&&!this.platform.is("mobileweb")){

      this.http.setServerTrustMode("nocheck");
      this.http.sendRequest(environment.BACK_API_MOBILE+'/api/orders/'+id ,{method: "get"
      ,serializer:"json",responseType:"json"}).then((data) => {
           this.order=data.data;
           this.destination.lat=data.data.restaurant.currentLatitude;
           this.destination.lng=data.data.restaurant.currentLongitude;
         })
    }else
    {
      this.order_service.getOrder(id).subscribe((data) => { 
        this.order=data;
        this.destination.lat=data.restaurant.currentLatitude;
        this.destination.lng=data.restaurant.currentLongitude;

      })
    }
   }

   getInfo(id) {
    if(!this.platform.is("desktop")&&!this.platform.is("mobileweb")){

     this.http.setServerTrustMode("nocheck");

     this.http.sendRequest(environment.BACK_API_MOBILE+'/api/deliveries/'+id ,{method: "get"
     ,serializer:"json",responseType:"json"}).then((data) => {
       
        this.source.lat=data.data.currentLatitude;
        this.source.lng=data.data.currentLongitude;
        this.delivery=data.data;
        
        })
    }else{

     this.order_service.getDelivery(id).subscribe((data) => {
      this.delivery=data;
      this.source.lat=data.currentLatitude;
      this.source.lng=data.currentLongitude;
      })

    }

   
      
  
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
            this.acceptOrder(this.order.id)
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalMapComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'source': this.source,
        'destination': this.destination
      }

    });
    return await modal.present();
  }

  acceptOrder(id){

    if(this.platform.is('mobileweb') || this.platform.is('desktop')){
      this.platform.ready().then(async() => {
        await  this.auth.getUser().then((response) => {
          this.order_service.accept(id,response.data.id).subscribe(
            data=>{
            },err=>{
            }
          )
        })
  
  })
    }else{
      this.platform.ready().then(async() => {
      await  this.auth.getUser().then((response) => {
        let data=JSON.parse(response.data);
        this.http.sendRequest(environment.BACK_API_MOBILE+'/api/orders/'+id,{method: "put",data:
        {
    
          status:  "INDELIVERY",
          delivery: "api/deliveries/"+data.data.id
  
                    
        }
        ,serializer:"json"})

      })
    })


    }



  }
}
