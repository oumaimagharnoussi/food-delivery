import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dark=false;

  constructor(private router:Router,
    public actionSheetController: ActionSheetController,
    private storage: AuthService) { }

  ngOnInit() {}
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Appearence',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Dark mode',
        role: 'destructive',
        icon: 'moon',
        handler: () => {
          this.onClick(true)
        }
      }, {
        text: 'Light mode',
        icon: 'sunny',
        handler: () => {
         this.onClick(false)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  profilePage(){
    this.router.navigate(['/app/settings/profile'])
  }
  payoutPage(){
    this.router.navigate(['/app/settings/payout'])
  }
  change(){
    if(this.dark==true){
      this.dark=false
    }else{
      this.dark=true
    }
  }
 async update(){
    await this.storage.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });
  }
  onClick(dark){
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(this.colorTest);
    if(dark){
      document.body.setAttribute('data-theme', 'dark');
      this.storage.set("dark",true)
    }
    else{
      document.body.setAttribute('data-theme', 'light');
      this.storage.set("dark",false)
    }
  }
  
   colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');		
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }

}
