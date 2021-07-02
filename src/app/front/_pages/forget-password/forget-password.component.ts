import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ResetPasswordService } from '../../_services/reset-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  step1: Boolean 
  step2: Boolean 
  step3: Boolean 
  email: String
  token: String
  password: String;

  constructor(private pwd_reset: ResetPasswordService,
    private toastCtrl: ToastController,
    private router: Router) {
    this.step1=true;
    this.step2=false;
    this.step3=false;

   }

  ngOnInit() {

  }

  async showMessage(message,color){
    
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
}

  send(){
  //call send verif mail


  this.pwd_reset.sendVerification(this.email).subscribe((response)=>{
    console.log(response);
    this.step1=false;
    this.step2=true;
    this.step3=false;

  },
  err=>{
    this.showMessage(err,"danger")

  })
  }

  verify(){
  //call send verif mail

  this.pwd_reset.verifyToken(this.token).subscribe(
    (response)=>{
      console.log(response)
      this.step1=false;
    this.step2=false;
    this.step3=true;
    },err=>{
      this.showMessage(err.error,"danger")
    }
  )
  }
  reset(){
  this.pwd_reset.resetPassword(this.token,this.password).subscribe(
    (response)=>{
      this.showMessage("password reset success","success").then(
        ()=>{
          this.step1=true
          this.step2=false
          this.step3=false
          this.router.navigate(['/login'])

        }
      )

    },
    err=>{
      this.showMessage(err.error,"danger")

    }
  )

    }

    redirect(route){
      this.router.navigate([route])
    }
    
}
