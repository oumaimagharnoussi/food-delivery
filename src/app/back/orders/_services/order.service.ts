import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  id: any;

  constructor(
    private http: HttpClientService) { 
      this.id= localStorage.getItem('userData')
      this.setEndpoint()


  }

 
  getAcceptedOrders(page): Observable<any> {
    this.setEndpoint()
    return this.http.findAll('?delivery.id='+this.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }

  getPickedOrders(page): Observable<any> {
    return this.http.findAll('?status=PICKED&delivery.id='+this.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }

  getPreparedOrders(page): Observable<any> {
    return this.http.findAll('?status=PICKED&delivery.id='+this.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }

  getUnPreparedOrders(page): Observable<any> {
    return this.http.findAll('?status=ACCEPTED&delivery.id='+this.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }

  getDeliveredOrders(page): Observable<any> {
    return this.http.findAll('?status=DELIVERED&delivery.id='+this.id+'&page='+page+'&order%5BacceptedDeliveryAt%5D=desc')
  }
  

  getOrderInfo(id): Observable<any>{
    this.setEndpoint()
    this.http.endpoint='orders';
    return this.http.findOne(id)

  }


acceptOrder(id): Observable<any>{
  this.setEndpoint()
  let order= {
    delivery:"api/deliveries/"+this.id,
    acceptedDeliveryAt: new Date()
  }
  return this.http.update(id,order);
}

pickOrder(id): Observable<any>{
  this.setEndpoint()
  let order= {
    status: "PICKED",
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

getDistances(orderID: number){
  this.http.endpoint='distances';
  return this.http.findAll('/'+this.id+'/'+orderID)


}



  setEndpoint(){
    this.http.endpoint='orders';
  }

}
