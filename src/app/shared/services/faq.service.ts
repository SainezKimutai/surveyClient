import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class FaqService {


    public url = `${dev.connect}api/faq/`;


    constructor( private http: HttpClient ) { }


    create( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers: header});
    }


    getAll() {
        return this.http.get<any>(this.url + 'getAll/', {headers: header});
    }


    getOne(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers: header});
    }


    update(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers: header});
    }


    delete(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers: header});
    }


}
