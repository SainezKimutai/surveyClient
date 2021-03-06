import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

    // tslint:disable: max-line-length


export class CustomerThirdPartyGuard implements CanActivate {

    constructor( private router: Router) {}

    canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (sessionStorage.getItem('permissionStatus') === 'isCustomer' || sessionStorage.getItem('permissionStatus') === 'isThirdParty') {
        return true;
        }

        this.router.navigate(['/landing_page']);
        return false;
    }

} // AdminGuard
