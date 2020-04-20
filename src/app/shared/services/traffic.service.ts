import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TrafficService {


    public url = `${dev.connect}api/traffic/`;


    constructor( private http: HttpClient ) { }


    createTraffic( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllTraffic() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneTraffic(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateTraffic(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteTraffic(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

}
