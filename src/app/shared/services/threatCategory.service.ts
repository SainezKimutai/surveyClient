import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ThreatCategoryService {


    public url = `${dev.connect}api/threatCategory/`;


    constructor( private http: HttpClient ) { }


    createThreatCategory( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllThreatCategorys() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getAllByInstitutions() {
        const data = {institutionId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

    getOneThreatCategory(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateThreatCategory(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteThreatCategory(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }


}
