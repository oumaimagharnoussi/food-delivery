import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';

import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ComissionService {
  

  constructor(
    private http: HttpClientService
    ) { 
     this.setEndpoint()
   

  }

  getDeliveryComissions(user,page): Observable<any>{
    this.setEndpoint()
   return this.http.findAll('?page='+page+'&delivery.id='+user.id+'&order%5BcreatedAt%5D=desc');
  }


  setEndpoint(){
    this.http.endpoint='comissions';
  }





  




 
  

}
