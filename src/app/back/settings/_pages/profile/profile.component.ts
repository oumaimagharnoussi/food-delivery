import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { ComissionService } from 'src/app/back/payments/_services/comission.service';
import { AuthService } from 'src/app/front/_services/auth.service';
import {environment} from 'src/environments/environment'
import { 
  Plugins
} from '@capacitor/core';
import { DeliveryService } from '../../_services/delivery.service';
const {Network} =Plugins;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  delivery= {
    firstName: "",
    lastName: "",
    telephone: "",
    email:""
  };
  offline: boolean;

  constructor(private delivery_serv: DeliveryService,
    private platform:Platform,
    private auth:AuthService,
    private changeRef: ChangeDetectorRef) { }

 async ngOnInit() {
    let status=await Network.getStatus();
    if(status.connected){
      this.getInfo()

      this.offline=false;
      this.changeRef.detectChanges();
    }else{
      this.offline=true;
      this.auth.get("deliveryInfo").then(
        test=>{
          this.delivery=test;
        }
       )
      this.changeRef.detectChanges();
      
    }

    let handler=Network.addListener('networkStatusChange',async(status)=>{
      if (status.connected){
   
        this.getInfo()

        this.offline=false;
        this.changeRef.detectChanges();
      }else{
        this.offline=true;
        this.auth.get("deliveryInfo").then(
          test=>{
            this.delivery=test;
          }
         )
        this.changeRef.detectChanges();
      }
     })
   
  }
  getInfo(){
   
     
          this.delivery_serv.getDelivery().subscribe(
            data=>{
              this.delivery=data
              this.auth.set('deliveryInfo',this.delivery)
              console.log(this.delivery)
            }
          )

        
    
  }
  

}
