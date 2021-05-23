import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClientService) {
    this.setEndpoint()
   }
  
   getDelivery(user:any): Observable<any>{
    this.setEndpoint()
     return this.http.findOne(user.id)
   }

   updateDelivery(user,data): Observable<any>{
     this.setEndpoint()
     return this.http.update(user.id,data)
   }

   setEndpoint(){
    this.http.endpoint='deliveries';
  }
}
