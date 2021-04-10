import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  side: Boolean;

  
  constructor() {}

  

  



   ngOnInit() {
    console.log(window.location.pathname.toString())
     if(window.location.pathname.toString()=="/auth/index" ||
        window.location.pathname.toString()=="/auth/login" || 
        window.location.pathname.toString()=="/auth/register" )
        {
       this.side=false;

     }else{
       this.side=true;
     }
 
    
    
     
    
    

}
  
}
