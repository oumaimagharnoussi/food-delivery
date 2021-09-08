import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import {Storage} from '@ionic/storage-angular'
import { map } from 'rxjs/operators';
import { DeviceIdService } from './device-id.service';


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
  headersMobile:any
  token:any

   

  constructor(private http: HttpClient,
    private httpNative: HTTP,private platform: Platform, private device_service: DeviceIdService,
    private  storage:Storage
   ) {
    this.getToken();
    }
  
    findAll(params:any): Observable<any> {
      //console.log("from ala:", this.device_service.uuid )
      
     
      
      if (this.platform.is('capacitor')) {
        this.getToken();
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.get(`${this.getUrl()}${params}`,{},this.headersMobile
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
  
    findOne(id: any): Observable<any> {
      if (this.platform.is('capacitor')) {
        this.getToken();
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.get(`${this.getUrl()}/${id}`,{},this.headersMobile)
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
        
        this.getToken();
        this.httpNative.setServerTrustMode("nocheck");
        return from(
          this.httpNative.sendRequest(this.getUrl(),{method: "post"
         ,data:object ,serializer:"json",headers:this.headersMobile})
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
        this.getToken();
        this.httpNative.setServerTrustMode("nocheck");
        return from(
         
          this.httpNative.delete(`${this.getUrl()}/${id}` ,  {},
         this.headersMobile )
  
        )

      }else{
        return this.http.delete<void>(`${this.getUrl()}/${id}`);
      }
     
    }

    update(id:any, object: any): Observable<any> {
      if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
        return this.http.put(`${this.getUrl()}/${id}`, object, httpOptions);
      }
      else{
        this.getToken();
        this.httpNative.setServerTrustMode("nocheck");
               
        return from(
  
        this.httpNative.sendRequest(`${this.getUrl()}/${id}`,{method: "put",data:
        object
        ,serializer:"json",headers:this.headersMobile})
  
      ).pipe(
        map(data=>{
          return JSON.parse(data.data)
        })
      )
      }
      
    }

    private getToken(){
      if(this.token){
        this.headersMobile={
          "Content-Type": "application/json",
          "accept": "application/json",
          "uuid": /*this.device_service.uuid*/"12345678",
          "Authorization": "Bearer "+this.token
        }
      }else{
        this.headersMobile={
          "Content-Type": "application/json",
          "accept": "application/json",
          "uuid": /*this.device_service.uuid*/"12345678"
        }

      }

   
          


        
    }

    private getUrl(): string {
      return `${environment.api_url}${this.endpoint}`;
    }


}
