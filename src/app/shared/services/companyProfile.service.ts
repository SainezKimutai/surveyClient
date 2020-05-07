import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class CompanyProfileService {


    public url = `${dev.connect}api/companyProfile/`;


    constructor( private http: HttpClient ) { }


    createCompanyProfile( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers: header});
    }


    getAllCompanyProfiles() {
        return this.http.get<any>(this.url + 'getAll/', {headers: header});
    }


    getOneCompanyProfile(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers: header});
    }

    getAllCompaniesByInstitutionId() {
        const data = {institutionId: localStorage.getItem('loggedUserInstitution')};
        console.log(data);
        return this.http.post<any>(this.url + 'institution/', data, {headers: header});
    }

    updateCompanyProfile(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers: header});
    }


    deleteCompanyProfile(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers: header});
    }


}
