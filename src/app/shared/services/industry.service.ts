import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class IndustryService {


    public url = `${dev.connect}api/industry/`;


    constructor( private http: HttpClient ) { }


    createIndustry( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllIndustrys() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneIndustry(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateIndustry(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteIndustry(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

}
