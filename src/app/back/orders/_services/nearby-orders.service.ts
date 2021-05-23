import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NearbyOrdersService {

  constructor(
    private http: HttpClientService
  ) { 
    this.setEndpoint()
    
  }

  getNearbyOrders(user){
    this.setEndpoint()
    return this.http.findOne(user.id)
  }

  setEndpoint(){
    this.http.endpoint='nearby_orders';
  }


  
}
