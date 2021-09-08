import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ComissionService } from 'src/app/back/payments/_services/comission.service';
import { AuthService } from 'src/app/front/_services/auth.service';
import {environment} from 'src/environments/environment'
import { PayoutService } from '../../_services/payout.service';
import { 
  Plugins
} from '@capacitor/core';
import { DeliveryService } from '../../_services/delivery.service';


const {Network} =Plugins;
@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.scss'],
})
export class PayoutListComponent implements OnInit {
  delivery: any;
  offline: boolean;
  userID: any;

  constructor(private delivery_serv: DeliveryService,
    private platform:Platform,private auth:AuthService,
   
    private router:Router,
    public alertController: AlertController,
    private  payout_service : PayoutService,
    private changeRef: ChangeDetectorRef,
    private toastController: ToastController,

   ) { 
    
    
    }

  
 
  
  async  offlineMode(){
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
    async  ngOnInit() { 
     this.offlineMode();

  
     // this.getInfo()
    }
  

    getInfo(){
    
      
           
            this.delivery_serv.getDelivery().subscribe(
              data=>{
                this.delivery=data
                this.auth.set('deliveryInfo',this.delivery)
              }
            )
       
       
    }


    delete(id){

     
        this.payout_service.deletePayoutMethod(id).subscribe(
          data => this.getInfo()   
        )
     

    }

    async deletetConfirm(id) {
      let status=await Network.getStatus();
      if(status.connected==false){
        this.notify("please connect to internet","warning")
        
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Confirm!',
          message: 'Are you sure <strong>delete</strong> payment method?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
               
              }
            }, {
              text: 'Okay',
              handler: () => {
                this.delete(id)
               
              }
            }
          ]
        });
    
        await alert.present();
      }
    
    }


  async addPage(){
    let status=await Network.getStatus();
    if(status.connected){
      this.router.navigate(['/app/settings/add'])
    }else{
      this.notify("please connect to internet","warning")
    }

  }
  async  notify(message,color){
    const toast1 = await this.toastController.create({
      message: message,
      duration: 4000,
      color:color
    });
    toast1.present();

  }

}
