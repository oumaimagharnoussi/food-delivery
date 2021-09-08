import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from './front/_services/auth.service';
import { MessagingService } from './front/_services/messaging.service';
import { Event} from '@angular/router';
import {Plugins} from '@capacitor/core';
import { AvailabilityService } from './back/_services/availability.service';
import { DeliveryService } from './back/settings/_services/delivery.service';
import { BackgroundGeolocation, BackgroundGeolocationAccuracy, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
const {Network} =Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  side=true;
  isOnline:boolean;
  long;
  lat;

  //background tracking config
  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 100,
    stationaryRadius: 300,
    distanceFilter: 100,
    
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };
  delivery=null;

  
  constructor(private toastController: ToastController,private backgroundGeolocation: BackgroundGeolocation,private geolocation: Geolocation,
    private changeRef: ChangeDetectorRef, private availability_serv :AvailabilityService,
     private auth_service:AuthService,private message:MessagingService,private router: Router,
     private platform: Platform,private delivery_serv: DeliveryService
     ) {
       this.auth_service.getToken();

      //this.initializeApp()
      let handler=Network.addListener('networkStatusChange',async(status)=>{
       if (status.connected){
      this.notify("you're online","success")
       }else{
       this.notify("you're offline","danger")
       }
      })
        let a=window.location.pathname.toString();
      
        this.router.events.subscribe((event: Event) => {
          if(a=="/"||a=="/index"||a=="/forget"||a=="/phone-verify"){
            this.side=false
            this.changeRef.detectChanges();
          }else{
            this.side=true
            this.changeRef.detectChanges();
            this.platform.ready().then(async() => {
              this.backgroundGeolocation.configure(this.config).then(() => {
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(async (location: BackgroundGeolocationResponse) => {
               /* console.log('Locations', location);
                this.notify(location.speed+"speed","warning")
                this.notify("New location ! "+location.latitude+"/"+location.longitude,"danger")*/
                await this.updateLocation(location.longitude,location.latitude);
                console.log('Speed', location.speed); // Tracks the speed of user
        
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
               // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
              // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
             // this.backgroundGeolocation.finish(); // FOR IOS ONLY
           });
        });
        
        this.geolocation.getCurrentPosition().then(async (resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          /*this.notify(resp.coords.latitude+"/"+resp.coords.longitude,"success")
          this.long=resp.coords.longitude
          this.lat=resp.coords.latitude*/
          await this.updateLocation(resp.coords.longitude,resp.coords.latitude)
         }).catch((error) => {
           console.log('Error getting location', error);
         });
         
         let watch = this.geolocation.watchPosition();
         watch.subscribe(async (data:any) => {
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          if(this.delivery){

            if((this.lat!=data.coords.latitude || this.long!=data.coords.longitude)
            && this.calcCrow(data.coords.latitude,data.coords.longitude,this.lat,this.long)>1
            && this.delivery.status=='AVAILABLE'){ 
             // this.notify(data.coords.latitude+"/"+data.coords.longitude,"success")
             await this.updateLocation(data.coords.longitude,data.coords.latitude)
            }

            if((this.lat!=data.coords.latitude || this.long!=data.coords.longitude)
            && this.calcCrow(data.coords.latitude,data.coords.longitude,this.lat,this.long)>0.3
            && this.delivery.status=='BUSY'){ 
             // this.notify(data.coords.latitude+"/"+data.coords.longitude,"success")
             await this.updateLocation(data.coords.longitude,data.coords.latitude)
            }


          }

         
         });
         if(this.delivery==null){
        
            this.delivery_serv.getDelivery().subscribe(
              data=>{
                this.delivery=data;
                if(this.delivery.status=="AVAILABLE"){
                  this.isOnline=true
                  this.start();
    
                }else{
                  this.isOnline=false
                  this.stop()
    
                }  
              })
        
            }else{
              if(this.delivery.status=="AVAILABLE"){
                this.isOnline=true
                this.start();
  
              }else{
                this.isOnline=false
                this.stop()
  
              }  

            }

            });
          }
        })

    

    }

    start() {
      this.backgroundGeolocation.start();
    }
    stop() {
      this.backgroundGeolocation.stop();
    }

        //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
         calcCrow(lat1, lon1, lat2, lon2) 
        {
          
          let R = 6371; // km
          let dLat =  this.toRad(lat2-lat1);
          let dLon =  this.toRad(lon2-lon1);
          lat1 =  this.toRad(lat1);
          lat2 =  this.toRad(lat2);
    
          let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          let d = R * c;
          return d;
        }
     // Converts numeric degrees to radians
     toRad(Value) 
     {
         return Value * Math.PI / 180;
     }


    setOnline(){
      this.availability_serv.setOnline();
      this.isOnline=true
      this.start()

    }

    setOffline(){
      this.availability_serv.setOffline();
      this.isOnline=false
      this.stop()
      
    }


  async  notify(message,color){
      const toast1 = await this.toastController.create({
        message: message,
        duration: 4000,
        color:color
      });
      toast1.present();

    }
  goToOrder(){
    this.router.navigate(['/orders'])
  }
  goToComission(){
    this.router.navigate(['/payments'])
  }
  goToSettings(){
    this.router.navigate(['/settings'])
  }
  goToProfile(){
    this.router.navigate(['/settings/profile'])
  }
  
  
  

  async logout() {
  this.stop();
  //disabled temporary
  /*this.delivery_serv.updateDelivery(this.delivery,{status:'OFFLINE'}).subscribe(
    (data)=>{
      this.delivery=data;       
    }
  )*/
  await this.message.deleteToken();
 
  await this.auth_service.logout().then(
  ()=>{
   // window.location.href = "/login";
  } 
 ); 
 
}

 async  ngOnInit() {
  let status=await Network.getStatus();
  if(status.connected){
    const toast1 = await this.toastController.create({
      message: "Welcome ..",
      duration: 100,
      color: "transparent"
    });
    toast1.present();
  
  }else{
    this.notify("you're offline","danger")
    
  }
 
}


async updateLocation(lng,lat){

  if(this.delivery==null){
   
      this.delivery_serv.getDelivery().subscribe(
        data=>{
          this.delivery=data
        }
      );
   
  }

  this.delivery_serv.updateDelivery({currentLongitude:lng, currentLatitude:lat}).subscribe(
    (data)=>{
      this.delivery=data;       
    }
  )
}

  
}
