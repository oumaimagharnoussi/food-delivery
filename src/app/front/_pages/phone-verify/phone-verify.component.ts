import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../_services/auth.service';
import { MessagingService } from '../../_services/messaging.service';
import { PhoneVerifService } from '../../_services/phone-verif.service';

@Component({
  selector: 'app-phone-verify',
  templateUrl: './phone-verify.component.html',
  styleUrls: ['./phone-verify.component.scss'],
})
export class PhoneVerifyComponent implements OnInit {
  @Input() telephone: any;

  digitOne:string;
  digitTwo:string;
  digitThree:string;
  digitFour:string;
  digitFive:string;
  digitSix:string;



  constructor(private router: Router,
    public modalController: ModalController,
    private verify_serv: PhoneVerifService,
    private auth:AuthService,private message:MessagingService) {

   }

  ngOnInit() {
 
  }

  async logout() {
    await this.message.deleteToken();
    await this.auth.logout().then(
     ()=>{
      // window.location.href = "/login";
     } 
    );
    
   }

   
  verify(){
    if(this.digitOne && this.digitTwo && this.digitThree && this.digitFour && this.digitFive && this.digitSix){
      let code=this.digitOne.concat(this.digitTwo,this.digitThree,this.digitFour,this.digitFive,this.digitSix)

      this.verify_serv.verifyNumber(this.telephone.number,code).subscribe(
        (res)=>{
          console.log(res.message);
          this.modalController.dismiss({
            'dismissed': true
          });
        },
        err=>{
          console.log(err.error.message)
        }
      )
      

    }

  }

  sendCode(){
    
    this.verify_serv.sendCode(this.telephone.number).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
  }



redirect(route){
  this.router.navigate([route])
}

}
