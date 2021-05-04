import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
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


  constructor(private platform:Platform,
    private auth:AuthService,
    private payout_service:PayoutService,
    private http:HTTP) {

    this.radioSelected = "card";
   }

  ngOnInit() {}
  addPaymentMethod(){
    this.platform.ready().then(async() => {

     
      await  this.auth.getUser().then((response) => {
        if(this.card){
          let data={
            type: "CARD",
            cardNumber:this.cardNumber,
            cardExpMonth: Number(this.cardExpMonth),
            cardExpYear: Number( this.cardExpYear),
            delivery: "api/deliveries/"+response.data.id
          }
          console.log(data)

          if(this.platform.is("desktop")||this.platform.is("mobileweb")){
            this.payout_service.addMethod(data).subscribe(
              data=>{
                console.log(data)
              }
            )

          }else{
            let user=JSON.parse(response.data);
            data.delivery=user.data.id;
            this.http.setServerTrustMode("nocheck");

            this.http.sendRequest(environment.BACK_API_MOBILE+'/api/payment_methods',{method: "post",data:
         data
            ,serializer:"json"}).then(
              response=>{

              }
            )

          }

        }
        if(this.money){
          let data={
            type:"MOBILEMONEY",
            mobile:this.mobile,
            delivery: "api/deliveries/"+response.data.id
          }
          console.log(data)
          if(this.platform.is("desktop")||this.platform.is("mobileweb")){
            this.payout_service.addMethod(data).subscribe(
              data=>{
                console.log(data)
              }
            )
          }else{
            let user=JSON.parse(response.data);
            data.delivery=user.data.id;
            this.http.setServerTrustMode("nocheck");

            this.http.sendRequest(environment.BACK_API_MOBILE+'/api/payment_methods',{method: "post",data:
         data
            ,serializer:"json"}).then(
              response=>{

              }
            )
            
          }
    
        }
        if(this.paypal){
          let data={
            type:"PAYPAL",
            email:this.email,
            delivery: "api/deliveries/"+response.data.id
          }
          console.log(data)
          if(this.platform.is("desktop")||this.platform.is("mobileweb")){
            this.payout_service.addMethod(data).subscribe(
              data=>{
                console.log(data)
              }
            )
          }else{
            let user=JSON.parse(response.data);
            data.delivery=user.data.id;
            this.http.setServerTrustMode("nocheck");

            this.http.sendRequest(environment.BACK_API_MOBILE+'/api/payment_methods',{method: "post",data:
         data
            ,serializer:"json"}).then(
              response=>{

              }
            )
            
          }
    
        }

      })
    })

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
