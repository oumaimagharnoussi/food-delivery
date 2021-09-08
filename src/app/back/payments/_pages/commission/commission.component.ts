import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent, IonInfiniteScroll, LoadingController, ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';

import { ComissionDetailsComponent } from './comission-details/comission-details.component';
import {environment} from 'src/environments/environment'
import { 
  Plugins
} from '@capacitor/core';
import { ComissionService } from '../../_services/comission.service';

const {Network} =Plugins;
@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
}) 
export class CommissionComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  comissions=[];
  page=1
  test=[];
  backToTop: boolean = false;
  customPopoverOptions: any = {
   
  };
  offline: boolean;
  attempts=0;
  userID: any;
  constructor(private router: Router,private comisson_service:ComissionService,
    
    private platform:Platform,private auth:AuthService,
    public modalController: ModalController,
    public loadingController: LoadingController,
    
    private changeRef: ChangeDetectorRef) { }

async  ngOnInit() {
    let status=await Network.getStatus();
    if(status.connected){
      
      this.getComissions(this.page)
      this.offline=false;
      this.changeRef.detectChanges();
    }else{
      this.offline=true;
      this.changeRef.detectChanges();
      this.auth.get("comissionList").then(
        test=>{
          this.comissions=test;
        }
       )
    }
    let handler=Network.addListener('networkStatusChange',async(status)=>{
      if (status.connected){
        this.comissions.length=0;
   
        this.getComissions(1)
        this.changeRef.detectChanges();
      }else{
        this.auth.get("comissionList").then(
          test=>{
            this.comissions=test;
         
            this.changeRef.detectChanges();
          }
         )
      }
     })

   
    

  }
 async doRefresh(event) {
    let status=await Network.getStatus();
    if(status.connected){
      console.log('Begin async operation');
      this.comissions.length=0;
      this.getComissions(1).then(
        ()=>{
          event.target.complete();
        }
      )
    }
    else{
      event.target.complete();
    }
  }
  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}
gotToTop() {
  this.content.scrollToTop(1000);
}
 async getComissions(page){
  
      
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
            mode: 'ios',
            translucent: true
          });
          await loading.present();
  
        this.comisson_service.getDeliveryComissions(page).subscribe(
          data=>{
            loading.dismiss();
            console.log('Loading dismissed!');
           
              if(page==1){
                this.auth.set('comissionList',data)
               }
              this.comissions=this.comissions.concat(data);
            
          
            this.attempts=0;
            this.test=data;
         
          
          },err=>{
            loading.dismiss();
            console.log('Loading dismissed!');

            if(this.attempts<10){
              this.getComissions(page)
              this.attempts++
            }else{
              console.log('backend error')
            }
           
          }
        )

  }
  detail(){
    this.router.navigate(['/payments/details/1'])
  }

 async loadData(event) {
    let status=await Network.getStatus();
    if(status.connected==false){
      setTimeout(() => {
        console.log('Done');
        this.page=1;
       
        event.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
      
      }, 500);

    }else{
      setTimeout(() => {
        console.log('Done');
        this.page++;
        this.getComissions(this.page)
        event.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.test.length==0) {
          event.target.disabled = true;
        }
      }, 500);

    }

  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async presentModal(comission) {
    const modal = await this.modalController.create({
      component: ComissionDetailsComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'comission': comission 
      }

    });
    return await modal.present();
  }
  

}
