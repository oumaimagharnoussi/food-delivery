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
const {Network} =Plugins;
@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.scss'],
})
export class PayoutListComponent implements OnInit {
  delivery: any;
  offline: boolean;

  constructor(private comisson_service:ComissionService,
    private platform:Platform,private auth:AuthService,
    private http: HTTP,
    private router:Router,
    public alertController: AlertController,
    private  payour_service : PayoutService,
    private changeRef: ChangeDetectorRef,
    private toastController: ToastController) { }

 async   addPage(){
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
        duration: 2000,
        color:color
      });
      toast1.present();

    }
    delete(id){

      if(this.platform.is("desktop")||this.platform.is("mobileweb")){
        this.payour_service.deleteMethod(id).subscribe(
          data=>{
          console.log("removed")
          this.getInfo()
          }
        )

      }else{
      
        this.http.setServerTrustMode("nocheck");
        this.http.delete(environment.BACK_API_MOBILE+'/api/payment_methods/'+id ,  {},
        {
          "Content-Type": "application/json",
          "accept": "application/json"
        }  ).then((data ) => {
          console.log("deleted")
          this.getInfo()
          
             
        })
      }

    }

    async deletetConfirm(id) {
      let status=await Network.getStatus();
      if(status.connected==false){
        this.notify("please connect to internet","warning")
        
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Confirm!',
          message: 'Message <strong>text</strong>!!!',
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
                this.delete(id)
                console.log('Confirm Okay');
              }
            }
          ]
        });
    
        await alert.present();
      }
    
    }

async  ngOnInit() { 
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

this.getInfo()
  }
  getInfo(){
    this.platform.ready().then(async() => {

     
      await  this.auth.getUser().then((response) => {
        if(this.platform.is("desktop")||this.platform.is("mobileweb")){
          this.comisson_service.getDelivery(response.data.id).subscribe(
            data=>{
              this.delivery=data
              this.auth.set('deliveryInfo',this.delivery)
              console.log(this.delivery)
            }
          )

        }else{
          let data=JSON.parse(response.data)
          this.http.setServerTrustMode("nocheck");
          this.http.get(environment.BACK_API_MOBILE+'/api/deliveries/'+data.data.id ,  {},
          {
            "Content-Type": "application/json",
            "accept": "application/json"
          }  ).then((data ) => {
            console.log(data)
            
               this.delivery= JSON.parse( data.data)
               this.auth.set('deliveryInfo',this.delivery)
          })
        }
      })
    })
  }

}
