import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { dev, header} from '../dev/dev';
  // tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})


export class GDPGrowthRateService {


    public url = `${dev.connect}api/gdp/`;


    constructor( private http: HttpClient ) { }


    createGDP( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllGDP() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneGDP(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateGDP(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteGDP(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllInstitutionGDP() {
        const data = {institutionId: localStorage.getItem('loggedUserID')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
