import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class QuestionService {


    public url = `${dev.connect}api/questions/`;


    constructor( private http: HttpClient ) { }


    createQuestion( data: any ) {
        return this.http.post<any>(this.url + 'create', data);
    }


    getAllQuestions() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneQuestion(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateQuestion(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteQuestion(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

    getQuestionsInASurvey(id){
        return this.http.get<any>(this.url + 'survey/' + id);
    }


}
