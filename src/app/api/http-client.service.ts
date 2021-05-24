import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


const httpOptions = { 
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'accept': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
   endpoint: string;
   headers:{
    "Content-Type": "application/json",
    "accept": "application/json"
  }

   

  constructor(private http: HttpClient,
    private httpNative: HTTP,private platform: Platform) {
     
    }
  
    findAll(params:any): Observable<any> {
     
      
      if (this.platform.is('capacitor')) {
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.get(`${this.getUrl()}${params}`,{},{
            "Content-Type": "application/json",
            "accept": "application/json"
          }
)
        ).pipe(
          map(data=>{
              if(typeof data.data ==='string'){
                return JSON.parse(data.data) ;
              }else{
                return data.data
              }
              
            
          })
        )
      }else{
        return this.http.get<any>(`${this.getUrl()}${params}`);
      }      
    }
  
    findOne(id: number): Observable<any> {
      if (this.platform.is('capacitor')) {
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.get(`${this.getUrl()}/${id}`,{},this.headers)
        ).pipe(
          map(data=>{
            return JSON.parse(data.data) 
          })
        )
      }else{
        return this.http.get<any>(`${this.getUrl()}/${id}`);
      }
    }
  
    save(object: any): Observable<any> {
      if (this.platform.is('capacitor')) {
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.sendRequest(this.getUrl(),{method: "post"
         ,data:object ,serializer:"json"})
        ).pipe(
          map(data=>{
            return data
          })
        )

      }else{
        return this.http.post<any>(this.getUrl(), object);

      }
      
    }
  
    delete(id: number): Observable<any> {
      if (this.platform.is('capacitor')) {
        this.httpNative.setServerTrustMode("nocheck");
        return from(
         
          this.httpNative.delete(`${this.getUrl()}/${id}` ,  {},
          {
            "Content-Type": "application/json",
            "accept": "application/json"
          }  )
  
        )

      }else{
        return this.http.delete<void>(`${this.getUrl()}/${id}`);
      }
     
    }

    update(id:Number, object: any): Observable<any> {
      if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
        return this.http.put(`${this.getUrl()}/${id}`, object, httpOptions);
      }
      else{
        this.httpNative.setServerTrustMode("nocheck");
               
        return from(
  
        this.httpNative.sendRequest(`${this.getUrl()}/${id}`,{method: "put",data:
        object
        ,serializer:"json"})
  
      ).pipe(
        map(data=>{
          return JSON.parse(data.data)
        })
      )
      }
      
    }

    private getUrl(): string {
      return `${environment.api_url}${this.endpoint}`;
    }


}
