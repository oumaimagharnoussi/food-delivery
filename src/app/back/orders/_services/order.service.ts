import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClientService) { 
      this.setEndpoint()


  }

 
  getAcceptedOrders(user,page): Observable<any> {
    this.setEndpoint()
    return this.http.findAll('?status=INDELIVERY&delivery.id='+user.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }

  getOrderInfo(id): Observable<any>{
    this.setEndpoint()
    this.http.endpoint='orders';
    return this.http.findOne(id)

  }


acceptOrder(id,user): Observable<any>{
  this.setEndpoint()
  let order= {
    delivery:"api/deliveries/"+user.id,
    status: "INDELIVERY",
    acceptedDeliveryAt: new Date()
  }
  return this.http.update(id,order);
}

finishOrder(id): Observable<any>{
  this.setEndpoint()
  let order= {
    status: "DELIVERED",
    deliveredAt: new Date()
  }
  return this.http.update(id,order);
}



  setEndpoint(){
    this.http.endpoint='orders';
  }

}
