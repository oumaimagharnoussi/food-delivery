import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
    //this.authService.init()
     
   }
 
 
    canActivate(): Observable<boolean> {   
      this.authService.ifLoggedIn(); 
     const test= this.authService.authState.pipe(
        filter(val => val !== null), // Filter out initial Behaviour subject value
        take(1), // Otherwise the Observable doesn't complete!
        map(isAuthenticated => {
         
          if (isAuthenticated) {          
            return true;
          } else {          
           
            this.router.navigate(['/login'])
            return false;
          }
        })
      );

      console.log(test)
      return test
    }
}