import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { ComissionService } from 'src/app/back/payments/_services/comission.service';
import { AuthService } from 'src/app/front/_services/auth.service';
import {environment} from 'src/environments/environment'
import { 
  Plugins
} from '@capacitor/core';
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

  constructor(private comisson_service:ComissionService,
    private platform:Platform,private auth:AuthService,
    private http: HTTP,
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
