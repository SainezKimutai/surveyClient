import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { dev, header} from '../dev/dev';
  // tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})


export class InterestRateService {


    public url = `${dev.connect}api/interestrates/`;


    constructor( private http: HttpClient ) { }


    createInterestRate( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllInterestRate() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneInterestRate(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateInterestRate(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteInterestRate(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllInstitutionInterestRate() {
        const data = {institutionId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
