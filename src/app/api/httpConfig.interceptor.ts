import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../front/_services/auth.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  
  constructor(private auth_service :AuthService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

   

    //Authentication by setting header with token value
    if (this.auth_service.token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.auth_service.token ) });
    }
    
      request = request.clone({ headers: request.headers.set('uuid', '12345678' ) });
    

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });


    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
                        // Catch "401 Unauthorized" responses
                        if ( error instanceof HttpErrorResponse && error.status === 401 )
                        {
                            // Sign out
                            this.auth_service.logout();
        
        
                        }
        console.error(error);
        return throwError(error);
      }));
  }


}