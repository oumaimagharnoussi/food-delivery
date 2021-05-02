import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { ComissionService } from 'src/app/back/payments/_services/comission.service';
import { AuthService } from 'src/app/front/_services/auth.service';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.scss'],
})
export class PayoutListComponent implements OnInit {
  delivery: any;

  constructor(private comisson_service:ComissionService,
    private platform:Platform,private auth:AuthService,
    private http: HTTP,
    private router:Router) { }

    addPage(){
      this.router.navigate(['/app/settings/add'])
    }

  ngOnInit() {

    this.platform.ready().then(async() => {

     
      await  this.auth.getUser().then((response) => {
        if(this.platform.is("desktop")||this.platform.is("mobileweb")){
          this.comisson_service.getDelivery(response.data.id).subscribe(
            data=>{
              this.delivery=data
              console.log(this.delivery)
            }
          )

        }else{
          let data=JSON.parse(response.data)
          this.http.setServerTrustMode("nocheck");
          this.http.get(environment.BACK_API_MOBILE+'/api/deliveries/'+data.data.id ,  {},
          {
            "Content-Type": "application/json",
            "accept": "application/json"
          }  ).then((data ) => {
            console.log(data)
            
               this.delivery= JSON.parse( data.data)
          })
        }
      })
    })
  }

}
