import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  id:any

  constructor(private http: HttpClientService) {
    this.setEndpoint()
    this.id= localStorage.getItem('userData')
   }
  
   getDelivery(): Observable<any>{
    this.setEndpoint()
     return this.http.findOne(this.id)
   }

   updateDelivery(data): Observable<any>{
     this.setEndpoint()
     return this.http.update(this.id,data)
   }

   setEndpoint(){
    this.http.endpoint='deliveries';
  }
}
