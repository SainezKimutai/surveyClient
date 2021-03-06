import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SurveyService {


    public url = `${dev.connect}api/survey/`;


    constructor( private http: HttpClient ) { }


    createSurvey( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllSurveys() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneSurvey(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateSurvey(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteSurvey(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllInstitutionSurveys() {
        console.log(header);
        const data = {institutionId: sessionStorage.getItem('loggedUserInstitution')};
        return this.http.post<any>(this.url + 'institution/', data, {headers: header});
    }
    getGeneralSurveys() {
        return this.http.get<any> (this.url + 'general/', {headers: header});
    }
    getAllInstitutionSurveysAdmin() {
        const data = {institutionId : sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'institution/', data, {headers: header});

    }

}
