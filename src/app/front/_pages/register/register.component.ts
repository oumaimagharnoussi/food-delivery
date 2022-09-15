import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import DeliveryBoy from '../../_models/DeliveryBoy';
import { RegisterService } from '../../_services/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpHeaders } from '@angular/common/http';
import { AlertController, Platform } from '@ionic/angular';
import {environment} from 'src/environments/environment'
import { ToastController } from '@ionic/angular';
import { MessagingService } from '../../_services/messaging.service';
import { LoadingController } from '@ionic/angular';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';
const { PushNotifications } = Plugins;
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
  register:boolean=true;

  form ={
    firstName: "",
    lastName: "",
    email: "",
    telephone: null,
    address: "",
    password:"",
   
  } ;
  token: string;
  loading :any;
  constructor(public loadingController: LoadingController,
    public toastController: ToastController,
    private platform:Platform,
    private http: HTTP,
    private register_service : RegisterService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private messagingService: MessagingService ) {
     
    }
  async showMessage(message,color){
    
      const toast = await this.toastController.create({
        message: message,
        duration: 4000,
        color: color,
        position: 'bottom'
      });
      toast.present();
  } 
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
  
  ValidateEmail(mail) 
  {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
    {
      return (true)
    }
      
      return (false)
  }

   colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute('data-theme', 'dark');		
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }
  async onSubmit(){
    
    const deliveryBoyInfo = new DeliveryBoy();
    deliveryBoyInfo.address=""
    deliveryBoyInfo.telephone= this.form.telephone.internationalNumber.split(" ").join(""); 
    deliveryBoyInfo.email=this.form.email;
    deliveryBoyInfo.password=this.form.password;
    deliveryBoyInfo.firstName=this.form.firstName;
    deliveryBoyInfo.lastName=this.form.lastName;
  
    console.log(deliveryBoyInfo.telephone)
    if(this.form.firstName == "" || this.form.lastName==""){
      this.pressed=true;
 
      this.showMessage("Please enter your name !","danger")
      return;
    }
    if(this.form.email == "" ){
      this.pressed=true;
  
      this.showMessage("Email is required !","danger")
      return;
    }
    if (!this.ValidateEmail( this.form.email) ){
      this.pressed=true;
  
      this.showMessage("Verify your mail syntax !","danger")
      return;
    } 
    if(this.form.telephone == "" ){
      this.pressed=true;
     
      this.showMessage("Phone number is required !","danger")
      return;
    }
    if(this.form.password == "" ){
      this.pressed=true;
     
      this.showMessage("Password is required !","danger")
      return;
    }

    if(this.form.password.length < 8 ){
      this.pressed=true;
     
      this.showMessage("Password min 8 caracters","danger")
      return;
    }
  

    if (this.confirm == this.form.password){
      this.loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Wait we\'re creating your account',
      });
      await this.loading.present();
 
        this.register_service.register(deliveryBoyInfo).subscribe(
          livreur=>{
            console.log(livreur)
            this.pressed=true;
            this.test=true;
            this.authenticate(deliveryBoyInfo.email,deliveryBoyInfo.password)
            this.form=new DeliveryBoy();
            this.confirm="";
            //this.router.navigate(['/login'])
            
          },async (error)=>{
            this.pressed=true;
            await this.loading.dismiss();
            console.log('Loading dismissed!');
            this.showMessage(error.error.detail,"danger")
  
          }
          
        );

      

    }
    else{
      this.pressed=true;
      
      this.showMessage("Verify confirmation password !","danger")

    }


   

    console.log(deliveryBoyInfo);
  }
  redirect(route){
    this.router.navigate([route])
  }

  authenticate(username,password){
    //call auth service
    let data=   {
     username:  username,
     password: password
   }
   if(data.username == ""){
     this.pressed=true;
 
     this.showMessage("Username required is required !","danger")
     return;
   }
 
   if(data.password == "" ){
     this.pressed=true;
 
     this.showMessage("Password is required !","danger")
     return;
   }
   this.authService.login(data)
   .subscribe((token: any) => {
     //initialise form control
     
     //request FCM token
     this.saveToken(token);
     window.location.href = "/app/orders";
 
   },async err=>{  
    await this.loading.dismiss();
    console.log('Loading dismissed!');
     this.showMessage(err.statusText,"danger")
     
 
   });
 
  }
  

  async saveToken(token){
  
      let tokenData= token.token
      this.authService.set('access_token',tokenData)  
      this.authService.token=tokenData;

      let userData= token.data.id
      this.authService.set('userData',userData)  
      this.authService.userId=userData;

 }
  
 redirectToLogin() {
  console.log('Login page !!!');
  this.register = false;
}

  
}
