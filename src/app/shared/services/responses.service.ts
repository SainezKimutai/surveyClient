import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ResponseService {


    public url = `${dev.connect}api/responses/`;



    constructor( private http: HttpClient ) { }


    createResponse( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllResponses() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneResponse(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateResponse(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteResponse(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

    getUsersResponses(id) {
        return this.http.get<any>(this.url + 'user/' + id);
    }

}
