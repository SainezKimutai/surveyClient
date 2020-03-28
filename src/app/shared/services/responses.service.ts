import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ResponseService {


    public url = `${dev.connect}api/responses/`;



    constructor( private http: HttpClient ) { }


    createResponse( data: any ) {

        console.log(data);
        
        const payload ={
            surveyId: data.surveyId,
            userId : data.userId,
            companyId: data.companyId,
            answers: []
          }
          
        for(var i =0; i< data.answers.length; i++){
        
            payload['answers'].push({
            questionId: data.answers[i].questionId,
            answer:[{
                threatId:data.answers[i].answer.threatId ? data.answers[i].answer.threatId: '',
                recom: data.answers[i].answer.threatId ? data.answers[i].answer.threat.inference: '', 
                level: data.answers[i].answer.threatId ? data.answers[i].answer.threat.category: '',
                answer: data.answers[i].answer.threat ? data.answers[i].answer[0].answer: data.answers[i].answer[0]}]
          })
        //    }
        //     else{
        //         payload['answers'].push({
        //             questionId: data.answers[i].questionId,
        //             answer: [{
        //                 answer: data.answers[i].answer[0]
        //             }]
        //          })
        //   }
        }
        console.log(payload);
        return this.http.post<any>(this.url + 'create', payload);
    }


    getAllResponses() {
        return this.http.get<any>(this.url + 'getAll/');
    }


    getOneResponse(id) {
        return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateResponse(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteResponse(id) {
        return this.http.delete<any>(this.url + 'delete/' + id);
    }

    getUsersResponses(id) {
        return this.http.get<any>(this.url + 'user/' + id);
    }

}
