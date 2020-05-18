import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class TaskPlanService {


    public url = `${dev.connect}api/taskPlan/`;


    constructor( private http: HttpClient ) { }


    createTaskPlan( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllTaskPlan() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }

    getAllTaskPlanByCompanyId() {
        const data = {companyId: localStorage.getItem('loggedCompanyId')};
        return this.http.post<any> (this.url + 'getByCompanyId/', data, {headers: header});
    }

    getOneTaskPlan(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateTaskPlan(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteTaskPlan(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    uploadPlanDocument( data: any ) {
        return this.http.post<any>(this.url + 'uploadPlanDocument/', data, {headers : header});
    }

    removePlanDocument(name) {
        return this.http.delete<any>(this.url + 'removePlanDocument/' + name, {headers : header});
    }

}
