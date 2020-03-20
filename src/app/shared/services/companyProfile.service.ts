import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class CompanyProfileService {


    public url = `${dev.connect}api/companyProfile/`;


    constructor( private http: HttpClient ) { }


    createCompanyProfile( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllCompanyProfiles() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneCompanyProfile(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateCompanyProfile(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteCompanyProfile(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }


}
