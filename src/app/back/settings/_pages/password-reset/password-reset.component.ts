import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import { MessagingService } from 'src/app/front/_services/messaging.service';
import { PasswordChangeService } from '../../_services/password-change.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  old:string =""
  new:string = ""
  newConfirm:string =""

  constructor( public toastController: ToastController, private password_serv: PasswordChangeService,
    private auth_service:AuthService,private message:MessagingService) { }

  ngOnInit() {}

  change(){
    if(this.old.length==0 || this.new.length==0 || this.newConfirm.length==0){
      this.showMessage("please fill all data","danger")
      return;
    }
    if(this.old == this.new){
      this.showMessage("please enter a different password ","danger")
      return;
    }

    if(this.newConfirm != this.new){
      this.showMessage("verify your new password confirm","danger")
      return;
    }

    this.password_serv.resetPassword(this.old,this.new).subscribe(
      (res)=>{
        this.showMessage(res.res,"success")
        this.new=""
        this.newConfirm=""
        this.old=""
        this.logout();
      },
      err=>{
        console.log(err)
        this.new=""
        this.newConfirm=""
        this.old=""
        this.showMessage(err.error.err,"danger")

      }
    )

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

async logout() {
  
  await this.message.deleteToken();
 
  await this.auth_service.logout().then(
  ()=>{
   // window.location.href = "/login";
  } 
 ); 
 
}
}
