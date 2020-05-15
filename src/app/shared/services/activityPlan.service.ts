import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ActivityPlanService {


    public url = `${dev.connect}api/activityPlan/`;


    constructor( private http: HttpClient ) { }


    createActivityPlan( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllPlanActivities() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneActivityPlan(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateActivityPlan(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteActivityPlan(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllActivityPlanByInstitutionId() {
        const data = {institutionId: localStorage.getItem('loggedUserInstitution')};
        return this.http.post<any> (this.url + 'institution/', data, {headers: header});
    }

}
