import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SurveyService {


    public url = `${dev.connect}api/survey/`;


    constructor( private http: HttpClient ) { }


    createSurvey( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllSurveys() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneSurvey(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateSurvey(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteSurvey(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }


}
