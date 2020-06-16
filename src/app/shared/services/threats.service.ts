import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ThreatService {


    public url = `${dev.connect}api/threats/`;


    constructor( private http: HttpClient ) { }


    createThreat( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllThreats() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneThreat(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }
    async getOneThreatName(id) {

     this.http.get<any>(this.url + 'getOne/' + id, {headers : header}).subscribe(data => {
         return data.name;
     });

        // return name;
    }


    updateThreat(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }

    getAllInstitutionThreats() {
        const data = {institutionId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'institution/', data, {headers: header});
    }


    deleteThreat(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

}
