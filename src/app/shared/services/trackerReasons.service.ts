import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TrackerReasonService {


    public url = `${dev.connect}api/trackerReason/`;


    constructor( private http: HttpClient ) { }


    createTrackerReason( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllTrackerReasons() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneTrackerReason(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateTrackerReason(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteTrackerReason(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

}
