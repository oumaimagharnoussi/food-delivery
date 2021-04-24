import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.radioSelected = "card";
   }

  ngOnInit() {}
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
