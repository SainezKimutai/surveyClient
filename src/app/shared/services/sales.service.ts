import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev , header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SalesService {


    url = `${dev.connect}api/opps/`;



    constructor( private http: HttpClient ) {  }


    addOppProject( oppProjectsData: any ) {
      return this.http.post<any>(this.url + 'create', oppProjectsData, {headers : header});
    }


    getAllOppProjectByCompany(iDparam: any) {
      const data = {companyId: iDparam};
      return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
    }

    getAllOppProject() {
      let data: any;
      if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      } else {
        data = {companyId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      }
    }


    getOppProject(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateOppProject(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteOppProject(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }


}
