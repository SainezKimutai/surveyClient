import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class IndustryService {


    public url = `${dev.connect}api/industry/`;


    constructor( private http: HttpClient ) { }


    createIndustry( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllIndustrys() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneIndustry(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateIndustry(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteIndustry(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllInstitutionIndustrys() {
        const data = {institutionId: sessionStorage.getItem('loggedUserInstitution')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
