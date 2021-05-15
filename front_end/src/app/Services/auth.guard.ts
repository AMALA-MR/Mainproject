import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router){
    }
   
    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):boolean{
        if(this.authService.loggedIn()){
            this.router.navigateByUrl('/login');
            return false;
        }else{
            return true;
        }
    }
    
}