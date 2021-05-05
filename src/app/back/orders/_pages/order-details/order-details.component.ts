import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { OrderService } from '../../_services/order.service';
import { ModalOrderComponent } from '../modal-order/modal-order.component';
declare var google;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements  OnInit, AfterViewInit  {
  id;
  userId;
  source = {
    lat: 37.4220656,
    lng: -122.0840897
  };
map:any;
  destination = {

    

    lat: 35.38303302544718,
    lng: 8.902773358214844
  };

 
 
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  order;
  delivery: any;
  constructor(public modalController: ModalController,public alertController: AlertController,private platform:Platform, private http: HTTP, private order_service:OrderService, private activaterout: ActivatedRoute,private fb: FormBuilder, private geolocation: Geolocation,private auth:AuthService) {
    this.createDirectionForm();
    //To modify until find sol for capturing id from url !!!!
    console.log(window.location.pathname.toString())
    let a=window.location.pathname.toString();
    let b=-1;

    for(let i=a.length-1;i>-1;i--){
      if(a[i]=='/') {b=i
        break;}
    }
    this.id=Number (a.slice(b+1,a.length))
   
  
   //console.log(this.userId)
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalOrderComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  getOrder(id) {
    if(!this.platform.is("desktop")&&!this.platform.is("mobileweb")){

      this.http.setServerTrustMode("nocheck");
      this.http.sendRequest('http://10.0.2.2:8000/api/orders/'+id ,{method: "get"
      ,serializer:"json",responseType:"json"}).then((data) => {
        
           this.order=data.data;
           this.destination.lat=data.data.restaurant.currentLatitude;
           this.destination.lng=data.data.restaurant.currentLongitude;
           //console.log(this.order)
          
         })
    }else{

      this.order_service.getOrder(id).subscribe((data) => {
      
        this.order=data;
        this.destination.lat=data.restaurant.currentLatitude;
        this.destination.lng=data.restaurant.currentLongitude;
        console.log(this.order)
       
      })

    }
   

  
       
   
   }
   getInfo(id) {
     if(!this.platform.is("desktop")&&!this.platform.is("mobileweb")){

      this.http.setServerTrustMode("nocheck");
 
      this.http.sendRequest('http://10.0.2.2:8000/api/deliveries/'+id ,{method: "get"
      ,serializer:"json",responseType:"json"}).then((data) => {
        
          this.source.lat=data.data.currentLatitude;
          this.source.lng=data.data.currentLongitude;
           this.delivery=data.data;
           console.log(this.delivery)
  
           this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: this.destination,
            mapId: '68e5f02535b42522',
            disableDefaultUI: true
          });
          this.directionsDisplay.setMap(this.map);
          var markerStart = new google.maps.Marker({
            position: this.source,
            icon: {
              url: './assets/imgs/truck_pin.svg',
              anchor: new google.maps.Point(35,10),
              scaledSize: new google.maps.Size(70, 70)
            },
            map: this.map
          });
          var destinationMarker = new google.maps.Marker({
            position: this.destination,
            icon: {
              url: './assets/imgs/destination_custom_pin.svg',
              anchor: new google.maps.Point(35,10),
              scaledSize: new google.maps.Size(70, 70)
            },
            map: this.map
          });
           this.geolocation.getCurrentPosition().then((resp) => {
          //  this.source.lat=resp.coords.latitude
          //  this.source.lng=resp.coords.longitude
            
         
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
          
         
          
         })
     }else{

      this.order_service.getDelivery(id).subscribe((data) => {
      
        this.source.lat=data.currentLatitude;
        this.source.lng=data.currentLongitude;
         this.delivery=data;
         console.log(this.delivery)
         this.geolocation.getCurrentPosition().then((resp) => {
        //  this.source.lat=resp.coords.latitude
        //  this.source.lng=resp.coords.longitude
          
          const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: this.destination,
            mapId: '68e5f02535b42522',
            disableDefaultUI: true
          });
          this.directionsDisplay.setMap(map);
          var markerStart = new google.maps.Marker({
            position: this.source,
            icon: {
              url: './assets/imgs/truck_pin.svg',
              anchor: new google.maps.Point(35,10),
              scaledSize: new google.maps.Size(70, 70)
            },
            map: map
          });
          var destinationMarker = new google.maps.Marker({
            position: this.destination,
            icon: {
              url: './assets/imgs/destination_custom_pin.svg',
              anchor: new google.maps.Point(35,10),
              scaledSize: new google.maps.Size(70, 70)
            },
            map: map
          });
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
        
       
        
       })

     }

    
       
   
   }
  async ngOnInit() {
    this.getOrder(this.id);

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

 /*   await this.auth.getUser().then(
      value=>{
        this.getInfo(3);
      }
    )
     */
  


/*
*/
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {

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
   calculateAndDisplayRoute (formValues) {

    const that = this;
    this.directionsService.route({
      origin: this.source,
      destination: this.destination ,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setOptions({
          suppressPolylines: false,
          map:document.getElementById("map")
        })
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  

}
