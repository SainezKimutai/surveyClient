import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TrackerService {


    public url = `${dev.connect}api/tracker/`;


    constructor( private http: HttpClient ) { }


    createTracker( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllTrackers() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneTracker(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateTracker(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteTracker(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

}
