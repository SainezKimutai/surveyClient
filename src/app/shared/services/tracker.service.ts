import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TrackerService {


    public url = `${dev.connect}api/tracker/`;


    constructor( private http: HttpClient ) { }


    createTracker( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllTrackers() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneTracker(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateTracker(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteTracker(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

}
