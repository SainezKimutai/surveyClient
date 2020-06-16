import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SalesSentEmailService {


    url = `${dev.connect}api/salesSentEmail/`;


    header = new HttpHeaders().set(
      'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
    );


    constructor( private http: HttpClient ) { }


    createEmail( notes: any ) {
      return this.http.post<any>(this.url + 'create', notes, {headers : this.header});
    }


    getAll() {
      let data: any;
      if (localStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: localStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : this.header});
      } else {
        data = {companyId: localStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : this.header});
      }
    }


    getOneEmail(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : this.header});
    }


    updateEmail(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : this.header});
    }


    deleteEmail(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : this.header});
    }


}
