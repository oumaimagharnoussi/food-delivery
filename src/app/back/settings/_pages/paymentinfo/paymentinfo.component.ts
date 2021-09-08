import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/front/_services/auth.service';
import {environment} from 'src/environments/environment'
import { PayoutService } from '../../_services/payout.service';

@Component({
  selector: 'app-paymentinfo',
  templateUrl: './paymentinfo.component.html',
  styleUrls: ['./paymentinfo.component.scss'],
})
export class PaymentinfoComponent implements OnInit {
  radioSelected:string;
  card=true;
  paypal=false;
  money=false;
  type:string;
  email:string;
  mobile:string;
  cardNumber:string;
  cardExpMonth:string;
  cardExpYear:string;

  phoneNumber :any;

  constructor(private platform:Platform,
    private auth:AuthService,
    private payout_service:PayoutService,
    public toastController: ToastController
    ) {

    this.radioSelected = "card";
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
   show(){
     console.log(this.phoneNumber)
   }

  ngOnInit() {}
  addPaymentMethod(){
    
        if(this.card){
          let data={
            type: "CARD",
            cardNumber:this.cardNumber,
            cardExpMonth: Number(this.cardExpMonth),
            cardExpYear: Number( this.cardExpYear),
            delivery: "api/deliveries/"+localStorage.getItem('userData')
          }
       
        
            this.payout_service.addNewPayoutMethod(data).subscribe(
              data=>{
                this.showMessage("Payment method added","success")
                window.location.href = "/app/settings/payout";
              },err=>{
                this.showMessage(err.statusText,"danger")

              }
            )

          

        }
        if(this.money){
          let data={
            type:"MOBILEMONEY",
            mobile:this.phoneNumber.internationalNumber,
            delivery: ""
          }
        
          
            this.payout_service.addNewPayoutMethod(data).subscribe(
              data=>{
             
                window.location.href = "/app/settings/payout";
              },err=>{
                this.showMessage(err.statusText,"danger")
              }
            )
          
           
    
        }
        if(this.paypal){
          let data={
            type:"PAYPAL",
            email:this.email,
            delivery: "api/deliveries/"+localStorage.getItem('userData')
          }
        
     
            this.payout_service.addNewPayoutMethod(data).subscribe(
              data=>{
               
                window.location.href = "/app/settings/payout";
              },err=>{
                this.showMessage(err.statusText,"danger")
              }
            )
          
    
        }

   

  }
  onItemChange(){
    if(this.radioSelected=="card"){
      this.card=true;
      this.money=false;
      this.paypal=false;
    }
    if(this.radioSelected=="money"){
      this.card=false;
      this.money=true;
      this.paypal=false;
    }
    if(this.radioSelected=="paypal"){
      this.card=false;
      this.money=false;
      this.paypal=true;
    }
  }


}
