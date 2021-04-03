import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './front/_services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private storage: StorageService) {}

  

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

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)

    
    await  this.storage.get("dark").then((response) => {
      console.log(response);

     
    
    
  });
}
  
}
