import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClientService } from 'src/app/api/http-client.service';


@Injectable({
  providedIn: 'root'
})
export class PayoutService {


  constructor(
    private http:HttpClientService
    
    ) {
      this.http.endpoint='payment_methods';


  }

  addNewPayoutMethod(data,user): Observable<any> {
    this.setEndpoint()
    
    data.delivery="api/deliveries/"+user.id;
    return this.http.save(data);

  }

  deletePayoutMethod(id){
    this.setEndpoint()
    return this.http.delete(id);

  }



  setEndpoint(){
    this.http.endpoint='payment_methods';
  }


}
