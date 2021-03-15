import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ClientService {


    url = `${dev.connect}api/clients/`;


    constructor( private http: HttpClient ) {}


    createClient( data: any ) {
      return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllClients() {
      let data: any;
      if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      } else {
        data = {companyId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      }
    }


    getOneClient(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    getOneByName(name) {
      return this.http.get<any>(this.url + 'getByName/' + name + '/', {headers : header});
    }


    updateClient(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteClient(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }


    sendMail( data: any ) {
      return this.http.post<any>(this.url + 'sendMail', data, {headers : header});
    }


}
