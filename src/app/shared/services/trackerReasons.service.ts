import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TrackerReasonService {


    public url = `${dev.connect}api/trackerReason/`;


    constructor( private http: HttpClient ) { }


    createTrackerReason( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllTrackerReasons() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneTrackerReason(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateTrackerReason(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteTrackerReason(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }
    getAllInstitutionTrackerReasons(){
        const data = {institutionId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
