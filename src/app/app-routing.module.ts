import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './front/_guards/auth-guard.service';
import { RegisterComponent } from './front/_pages/register/register.component';

const routes: Routes = [


  {
    path: '',
    loadChildren: () => import('./front/front.module').then( m => m.FrontModule)
  },


  {
    path: 'app',
    
    loadChildren: () => import('./back/back.module').then( m => m.BackModule),
    canActivate:[AuthGuardService]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
