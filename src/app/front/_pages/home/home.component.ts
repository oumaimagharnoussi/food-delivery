import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dark=false;
  pushes: any = [];
  token="";
  public  url = 'https://food.dev.confledis.fr';
  public greetingsData: any;


  constructor(private router: Router, private auth_service: AuthService
 , private http: HttpClient
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





   await this.auth_service.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

   this.greetings(this.url).subscribe(
    (data) => {this.greetingsData = data;
    console.log(data);
    }
  );


}
greetings(url: string) {
  return this.http.get(`${url}/greetings`, 
    {headers:{"accept": "application/json"}
    });
}


}
