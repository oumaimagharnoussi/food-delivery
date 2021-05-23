import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../_services/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dark=false;
  pushes: any = [];
  token="";


  constructor(private storage: AuthService, private router: Router,
 ) { 
      this.storage.ifNotLoggedIn()
    

  

  }
  redirect(route){
    this.router.navigate([route])
  }

 
 
  change(){
    if(this.dark==true){
      this.dark=false
    }else{
      this.dark=true
    }
  }


 

  async ngOnInit() {





   await this.storage.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });




}

onClick(event){
  let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.addListener(this.colorTest);
  if(event.detail.checked){
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
