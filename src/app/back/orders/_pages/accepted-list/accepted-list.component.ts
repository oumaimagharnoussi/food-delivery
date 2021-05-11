import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { IonContent, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { OrderService } from '../../_services/order.service';
import { SseService } from '../../_services/sse.service';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import {environment} from 'src/environments/environment'
import { StorageService } from 'src/app/front/_services/storage.service';
import { 
  Plugins
} from '@capacitor/core';
const {Network} =Plugins;
@Component({
  selector: 'app-accepted-list',
  templateUrl: './accepted-list.component.html',
  styleUrls: ['./accepted-list.component.scss'],
})
export class AcceptedListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  loading=true;
  primaryColor="#bdd0da"
  orders=[];
  destination = {
    lat: 35.38303302544718,
    lng: 8.902773358214844
  };
  source = {
    lat: 35.48303302544718,
    lng: 8.702773358214844
  };
  page=1;
  test=[];
  offline;
  customPopoverOptions: any = {
    
  };
 

  constructor(private order_service: OrderService, 
    private platform:Platform,
    private storage: AuthService,
    public modalController: ModalController,
    private http: HTTP,
    private sse:SseService,
    private router:Router,
    private offline_storage:StorageService,
    private changeRef: ChangeDetectorRef,
    private toastController: ToastController) { 

    }
    async  notify(message,color){
      const toast1 = await this.toastController.create({
        message: message,
        duration: 2000,
        color:color
      });
      toast1.present();

    }
 async   detail(id){
      let status=await Network.getStatus();
      if(status.connected==false){
        this.notify("please connect to internet","warning")

      }else{
        this.router.navigate(['/orders/info/'+id])
      }
     
    }
 async ngOnInit() {
    let status=await Network.getStatus();
    if(status.connected){
      this.getAcceptedOrders(1)
      this.offline=false;
      this.changeRef.detectChanges();
    }else{
      this.offline=true;
      this.changeRef.detectChanges();
      this.storage.get("acceptedList").then(
        test=>{
          this.orders=test;
        }
       )
    }

    let handler=Network.addListener('networkStatusChange',async(status)=>{
      if (status.connected){
   
        this.getAcceptedOrders(1)
        this.changeRef.detectChanges();
      }else{
        this.storage.get("acceptedList").then(
          test=>{
            this.orders=test;
            this.loading=false
            this.changeRef.detectChanges();
          }
         )
      }
     })

    
    this.sse.returnAsObservable().subscribe(data=>
      {
        //this.getAcceptedOrders(1)

      })
  }
  gotToTop() {
    this.content.scrollToTop(1000);
  }
 async loadData(event) {
    let status=await Network.getStatus();
    if(status.connected==false){
      setTimeout( () => {
        console.log('Done');
      
       
        event.target.complete();
       
   
        event.target.disabled = true;
      
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
  
      }, 1500);
    }else{
      let size=this.orders.length
      setTimeout( () => {
        console.log('Done');
      
        this.page+=1;
        this.getAcceptedOrders(this.page)
        event.target.complete();
        console.log(this.test)
      if (this.test.length==0) {
        event.target.disabled = true;
      }
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
  
      }, 500);
    }


  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  getAcceptedOrders(page){
  
    
    if(this.platform.is('mobileweb') || this.platform.is('desktop')){
     // this.sse.GetExchangeData('http://127.0.0.1:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');
      this.platform.ready().then(async() => {
        await  this.storage.getUser().then((response) => {
          this.order_service.getAcceptedOrders(response.data.id,page).subscribe(
             (data : any[])=>{
               if(page==1){
                this.storage.set('acceptedList',data)
               }
              this.orders=this.orders.concat(data)
              this.test=data
              this.loading=false
            }
          )
        })
      })
    }else{
   //   this.sse.GetExchangeData('http://10.0.2.2:8000/.well-known/mercure?topic=http://127.0.0.1:8000/api/orders/{id}');
      this.platform.ready().then(async() => {
        await  this.storage.getUser().then((response) => {
          let data=JSON.parse(response.data)
          this.http.setServerTrustMode("nocheck");
          this.http.get(environment.BACK_API_MOBILE+'/api/orders?status=INDELIVERY&delivery.id='+data.data.id ,  {},
          {
            "Content-Type": "application/json",
            "accept": "application/json"
          }  ).then((data ) => {
      
            this.storage.set('acceptedList',JSON.parse(data.data))
               this.orders= this.orders.concat( JSON.parse(data.data))
               this.loading=false
          })

       
        })
      })
    }
}

  async presentModal(order) {
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

}
