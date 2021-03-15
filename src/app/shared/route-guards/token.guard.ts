import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class TokenGuard implements CanActivate {

  constructor( private router: Router) {}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      if (window.sessionStorage.getItem('loggedUserToken') != null) {
      return true;
      }

      this.router.navigate(['/landing_page']);
      return false;
  }


}



