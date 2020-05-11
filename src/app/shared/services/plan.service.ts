import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class PlansService {


    public url = `${dev.connect}api/plan/`;


    constructor( private http: HttpClient ) { }


    createPlan( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllPlans() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOnePlan(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updatePlan(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deletePlan(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllCompanyPlans() {
        const data = {institutionId: localStorage.getItem('loggedCompanyId')};
        return this.http.post<any> (this.url + 'company/', data, {headers: header});
    }

}
