import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class QuestionService {


    public url = `${dev.connect}api/questions/`;


    constructor( private http: HttpClient ) { }


    createQuestion( data: any ) {
        console.log(data);
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllQuestions() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneQuestion(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateQuestion(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteQuestion(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getQuestionsInASurvey(id) {
        return this.http.get<any>(this.url + 'survey/' + id, {headers : header});
    }



}
