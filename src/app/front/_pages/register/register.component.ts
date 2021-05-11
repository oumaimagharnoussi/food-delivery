import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import DeliveryBoy from '../../_models/DeliveryBoy';
import { RegisterService } from '../../_services/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
 

  confirm:string;
  dark =false;
  test=false;
  pressed=false;
  errMsg="";

  form:  DeliveryBoy ={
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    password:"",
   
  } ;

  constructor(private platform:Platform,private http: HTTP,private register_service : RegisterService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    this.authService.ifNotLoggedIn()
    await this.authService.getDark().then((test)=>{
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
  onSubmit(){
    const deliveryBoyInfo = new DeliveryBoy();
    deliveryBoyInfo.address=""
    deliveryBoyInfo.telephone=this.form.telephone
    deliveryBoyInfo.email=this.form.email;
    deliveryBoyInfo.password=this.form.password;
    deliveryBoyInfo.firstName=this.form.firstName;
    deliveryBoyInfo.lastName=this.form.lastName;
  

    if(this.form.firstName == "" || this.form.lastName==""){
      this.pressed=true;
      this.errMsg="Please enter your name !"
      return;
    }
    if(this.form.telephone == "" ){
      this.pressed=true;
      this.errMsg="Phone number is required !"
      return;
    }

    if (this.confirm == this.form.password){
      if (this.platform.is("mobileweb")|| this.platform.is("desktop")){
        this.register_service.register(deliveryBoyInfo).subscribe(
          livreur=>{
            console.log(livreur)
            this.pressed=true;
            this.test=true;
            this.form=new DeliveryBoy();
            this.confirm="";
            this.router.navigate(['/login'])
          },error=>{
            this.pressed=true;
            this.errMsg="Mail or phone already exists"
  
          }
          
        );

      }else{
        this.http.setServerTrustMode("nocheck");

        this.http.sendRequest(environment.BACK_API_MOBILE+'/api/deliveries',{method: "post",data:
        {
  
  
          "firstName": deliveryBoyInfo.firstName.toString(),
          "lastName": deliveryBoyInfo.lastName.toString(),
          "email":  deliveryBoyInfo.email.toString(),
          "telephone": deliveryBoyInfo.telephone.toString()
        
        
        }
        ,serializer:"json"}).then(response => {
          // prints 200
          console.log(response);
          this.router.navigate(['/login'])
        })
        .catch(response => {
          // prints 403
          console.log(response.status);
  
          // prints Permission denied
          console.log(response.error);
        });


      }

      

      
     


    }
    else{
      this.pressed=true;
      this.errMsg="Verify your confirmation password"

    }


   

    console.log(deliveryBoyInfo);
  }
  redirect(route){
    this.router.navigate([route])
  }

  
}
