import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})

// tslint:disable
export class ResponseService {


    public url = `${dev.connect}api/responses/`;



    constructor( private http: HttpClient ) { }


    createResponse( data: any ) {

        const payload = {
            surveyId: data.surveyId,
            userId : data.userId,
            companyId: data.companyId,
            answers: []
          };
        
        for (let i = 0; i < data.answers.length; i++) {
            payload.answers.push({
            questionId: data.answers[i].questionId,
            answer: [{
                threatId: data.answers[i].answer.threatId ? data.answers[i].answer.threatId : '',
                threat: data.answers[i].answer.threatName ? data.answers[i].answer.threatName: '',
                recom: (data.answers[i].answer.threatId && data.answers[i].answer.threat)  ? data.answers[i].answer.threat.inference : '',
                level: (data.answers[i].answer.threatId && data.answers[i].answer.threat)  ? data.answers[i].answer.threat.category : '',
                answer: (data.answers[i].answer.threat && data.answers[i].answer.threat) ? data.answers[i].answer[0].answer : data.answers[i].answer[0]
            }]
          });

        }
        return this.http.post<any>(this.url + 'create', payload, {headers : header});
    }


    getAllResponses() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneResponse(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }

    getByUserIdCompanyIdSurveyId(data) {
        return this.http.post<any>(this.url + 'getByUserIdCompanyIdSurveyId/', data,  {headers : header});
    }


    updateResponse(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteResponse(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getUsersResponses(id) {
        return this.http.get<any>(this.url + 'user/' + id, {headers : header});
    }

}
