import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ClientService {


    url = `${dev.connect}api/clients/`;


    header = new HttpHeaders().set(
      'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
    );


    constructor( private http: HttpClient ) {}


    createClient( data: any ) {
      return this.http.post<any>(this.url + 'create', data, {headers : this.header});
    }


    getAllClients() {
      let data: any;
      if (localStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: localStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : this.header});
      } else {
        data = {companyId: localStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : this.header});
      }
    }


    getOneClient(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : this.header});
    }


    getOneByName(name) {
      return this.http.get<any>(this.url + 'getByName/' + name + '/', {headers : this.header});
    }


    updateClient(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : this.header});
    }


    deleteClient(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : this.header});
    }


    sendMail( data: any ) {
      return this.http.post<any>(this.url + 'sendMail', data, {headers : this.header});
    }


}
