import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../_services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errMsg= ""
  err=false;
  pressed=false;
  dark=false;

  loginForm = {
    username:'',
    password:''
  };


  constructor(private authService:AuthService) { }

  async ngOnInit() {
    await this.authService.getDark().then((test)=>{
      if (test) {document.body.setAttribute('data-theme', 'dark');	
    this.dark=true}
      else {document.body.setAttribute('data-theme', 'light');
    this.dark=false	}

   });

  }
  login(){
    

    this.authService.login(this.loginForm)
    .subscribe((token: any) => {
      this.pressed=true;
      this.err=false
      this.authService.set('access_token',token)
    console.log(token)
    },error=>{
      this.pressed=true;
      this.err=true;
      this.errMsg="Verify your credentials!"

    }
    );
  
 }

 onClick(event){
  let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.addListener(this.colorTest);
  if(event.detail.checked){
    document.body.setAttribute('data-theme', 'dark');
    this.authService.set("dark",true)
  }
  else{
    document.body.setAttribute('data-theme', 'light');
    this.authService.set("dark",false)
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
