import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NearbyOrdersService {
  id: any;

  constructor(
    private http: HttpClientService
  ) { 
    this.id= localStorage.getItem('userData')
    this.setEndpoint()
    
  }

  getNearbyOrders(){
    this.setEndpoint()
    return this.http.findOne(this.id)
  }

  getRecentNearbyOrders(){
    this.setEndpoint()
    return this.http.findOne(this.id)
  }

  setEndpoint(){
    this.http.endpoint='nearby_orders';
  }


  
}
