import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { dev, header} from '../dev/dev';
  // tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})


export class ExchangerateService {


    public url = `${dev.connect}api/exchangerates/`;


    constructor( private http: HttpClient ) { }


    fetchExchangeRates( ) {
        const params = new HttpParams() .set('app_id', '798715814eab4268abf21640d0308d2a');
        const myUrl = 'https://openexchangerates.org/api/latest.json';
        return this.http.get<any>(myUrl, {params});
    }

    fetchPastExchangeRates(date ) {
        const params = new HttpParams() .set('app_id', '798715814eab4268abf21640d0308d2a');
        const myUrl = `https://openexchangerates.org/api/historical/${date}.json`;
        return this.http.get<any>(myUrl, {params});
    }


    createExchangerate( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllExchangerates() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneExchangerate(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateExchangerate(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteExchangerate(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllInstitutionExchangerates() {
        const data = {institutionId: localStorage.getItem('loggedUserID')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
