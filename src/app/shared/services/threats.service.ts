import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ThreatService {


    public url = `${dev.connect}api/threats/`;


    constructor( private http: HttpClient ) { }


    createThreat( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllThreats() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneThreat(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateThreat(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteThreat(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

}
