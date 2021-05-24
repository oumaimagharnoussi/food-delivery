import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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


  constructor(private router: Router, private auth_service: AuthService
 ) { 
      this.auth_service.ifNotLoggedIn()
    

  

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



}


}
