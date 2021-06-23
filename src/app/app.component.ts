import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from './front/_services/auth.service';
import { MessagingService } from './front/_services/messaging.service';
import { Event} from '@angular/router';
import {Plugins} from '@capacitor/core';

const {Network} =Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  side=true;

  
  constructor(private toastController: ToastController,
    private changeRef: ChangeDetectorRef,
     private auth:AuthService,private message:MessagingService,private router: Router,
     ) {
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
          if(a=="/"||a=="/index"||a=="/login"||a=="/register"){
            this.side=false
            this.changeRef.detectChanges();
          }else{
            this.side=true
            this.changeRef.detectChanges();
          }
        })

    

    }

  async  notify(message,color){
      const toast1 = await this.toastController.create({
        message: message,
        duration: 2000,
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
 await this.message.deleteToken();
 await this.auth.logout().then(
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

  
}
