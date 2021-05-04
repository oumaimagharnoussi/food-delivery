import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './front/_services/auth.service';
import { MessagingService } from './front/_services/messaging.service';
import { ConnectionStatus, NetworkService } from './front/_services/network.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  side=true;

  
  constructor(  private networkService: NetworkService,
    private platform:Platform, private auth:AuthService,private message:MessagingService,private router: Router) {
      this.initializeApp()
    }

  
    initializeApp() {
      this.platform.ready().then(() => {
      
   
        this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
          if (status == ConnectionStatus.Online) {
           console.log("hey you re connected again ! ")
          }else{
            console.log("hey you re connected again ! ")

          }
        });
      });
    }
  

  logout() {
  this.message.deleteToken();
  this.auth.logout();
  

  


}

   ngOnInit() {/*
    console.log(window.location.pathname.toString())
    this.platform.ready().then(async() => {
      if(window.location.pathname.toString()=="/index" ||
      window.location.pathname.toString()=="/" || 
      window.location.pathname.toString()=="/login" || 
      window.location.pathname.toString()=="/register" )
      {
     this.side=false;

   }else{
     this.side=true;
   }

    });

*/
 
}

  
}
