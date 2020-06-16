import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dev , header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SalesCategoryService {


    url = `${dev.connect}api/salesCategory/`;


    // header = new HttpHeaders().set(
    //   'Authorization', `Bearer ${window.sessionStorage.getItem('loggedUserToken')}`
    // );


    constructor( private http: HttpClient ) { }


    addSalesCategory( data: any ) {
      return this.http.post<any>(this.url + 'create', data, {headers : header} );
    }


    getSaleCat(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header} );
    }


    getAllSalesCategoriesByCompany(iDparam: any) {
      const data = {companyId: iDparam};
      return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
    }

    getAllSalesCategories() {
      let data: any;
      if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      } else {
        data = {companyId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      }
    }


    updateSaleCategory(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header} );
    }


    deleteSaleCategory(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header} );
    }


}
