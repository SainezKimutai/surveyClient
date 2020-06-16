import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SalesSentEmailService {


    url = `${dev.connect}api/salesSentEmail/`;


    constructor( private http: HttpClient ) { }


    createEmail( notes: any ) {
      return this.http.post<any>(this.url + 'create', notes, {headers : header});
    }


    getAll() {
      let data: any;
      if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      } else {
        data = {companyId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      }
    }


    getOneEmail(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateEmail(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteEmail(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }


}
