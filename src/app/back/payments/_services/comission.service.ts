import { Injectable } from '@angular/core';

import {  Observable } from 'rxjs';

import { HttpClientService } from 'src/app/api/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ComissionService {
  id: any;
  

  constructor(
    private http: HttpClientService
    ) { 
      this.id= localStorage.getItem('userData')
      this.setEndpoint()
   

  }

  getDeliveryComissions(page): Observable<any>{
    this.setEndpoint()
   return this.http.findAll('?page='+page+'&delivery.id='+this.id+'&order%5BcreatedAt%5D=desc');
  }


  setEndpoint(){
    this.http.endpoint='comissions';
  }





  




 
  

}
