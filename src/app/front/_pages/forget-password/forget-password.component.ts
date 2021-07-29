import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  username: String
  token: String
  password: String;
  verify_method: String;

  telephone: any;

  digitOne:string;
  digitTwo:string;
  digitThree:string;
  digitFour:string;
  digitFive:string;
  digitSix:string;
  code: string;

  constructor(private pwd_reset: ResetPasswordService,
    private toastCtrl: ToastController,
    private router: Router, private activatedRoute: ActivatedRoute) {
      this.activatedRoute.queryParams.subscribe(params => {
        
        this.token = params['token'];
        console.log(this.token)
        if(this.token==""||this.token==null){
          this.step1=true;
          this.step2=false;
          this.step3=false;
        }else{
          
          this.pwd_reset.verifyToken(this.token).subscribe(
            (response)=>{
              console.log(response)
              this.step1=false;
            this.step2=false;
            this.step3=true;
            },err=>{
              this.step1=true;
              this.step2=false;
              this.step3=false;
              this.token=""
              this.showMessage(err.error,"danger")
            }
          )
    
        }
    
    });



   }

  ngOnInit() {

  }

  verifyEmail(){
    
  }

  async showMessage(message,color){
    
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      color: color,
      position: 'bottom'
    });
    toast.present();
}

  send(){
  //call send verif mail
    const regexPhone= /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    const validPhone = this.username.match(regexPhone);
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail= regexEmail.test(this.username.toLowerCase());
    if(!validEmail && !validPhone) {
      return this.showMessage("please enter a valid email/telephone","danger")
      
    }

  this.pwd_reset.sendVerification(this.username).subscribe((response)=>{
    if(this.username.includes("@")){
      this.verify_method="email"
    }else{
      this.verify_method="phone"
    }
    console.log(response);
    this.step1=false;
    this.step2=true;
    this.step3=false;

  },
  err=>{
    console.log(err);
    this.showMessage(err.error,"danger")

  })

  }
  verifyCode(){
    if(this.digitOne && this.digitTwo && this.digitThree && this.digitFour && this.digitFive && this.digitSix){
      this.code=this.digitOne.concat(this.digitTwo,this.digitThree,this.digitFour,this.digitFive,this.digitSix)

    this.pwd_reset.verifyCode(this.username,this.code).subscribe(
      res=>{
        this.token=res.token;
        this.step1=false;
        this.step2=false;
        this.step3=true;

      },
      err=>{
        this.showMessage(err.error,"danger") 
      }
    )
      

    }

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

  resetByPhone(){
    this.pwd_reset.resetPasswordWithPhone(this.token,this.password).subscribe(
      res=>{
        this.showMessage("password reset success","success").then(
          ()=>{
            this.step1=true
            this.step2=false
            this.step3=false
            this.router.navigate(['/login'])
  
          }
        )
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
